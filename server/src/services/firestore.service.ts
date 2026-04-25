import admin from 'firebase-admin';
import { ChatMessage, FirestoreSession } from '../types/index';
import logger from '../utils/logger';

/** In-memory fallback store when Firebase is not configured or credentials are invalid. */
const inMemoryStore = new Map<string, FirestoreSession>();

/**
 * Tracks whether Firebase initialized successfully.
 * Set to false if credentials are missing OR if initializeApp throws (bad key).
 */
let firebaseReady = false;

/**
 * Initializes Firebase Admin SDK using service account credentials from environment variables.
 *
 * Key handling: dotenv stores multiline values with literal `\n` sequences.
 * We replace `\\n` → real newlines so the PEM key parses correctly.
 *
 * If any credential is missing or the private key is invalid/placeholder,
 * the service silently falls back to in-memory session storage.
 */
function initializeFirebase(): void {
  // Already attempted — don't retry
  if (firebaseReady || admin.apps.length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // Guard: any credential missing or still has placeholder value
  if (
    !projectId ||
    !rawKey ||
    !clientEmail ||
    projectId.includes('your_firebase') ||
    rawKey.includes('your_private_key') ||
    clientEmail.includes('firebase-adminsdk-xxxxx')
  ) {
    logger.warn('Firebase credentials not set — using in-memory session storage');
    return;
  }

  // Replace literal \n sequences with actual newlines (dotenv artifact)
  const privateKey = rawKey.replace(/\\n/g, '\n');

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
    });
    firebaseReady = true;
    logger.info('Firebase Admin SDK initialized', { projectId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('Firebase initialization failed — using in-memory session storage', { reason: message });
    // Do NOT rethrow — graceful fallback to inMemoryStore
  }
}

/**
 * Returns true only when Firebase is connected and ready.
 * This is called lazily before each DB operation.
 */
function isFirestoreAvailable(): boolean {
  initializeFirebase();
  return firebaseReady;
}

/**
 * Creates a new chat session document in Firestore (or in-memory fallback).
 *
 * @param sessionId - Unique identifier for this chat session
 * @returns The created session object
 */
export async function createSession(sessionId: string): Promise<FirestoreSession> {
  const session: FirestoreSession = {
    sessionId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };

  if (isFirestoreAvailable()) {
    try {
      const db = admin.firestore();
      await db.collection('sessions').doc(sessionId).set(session);
      logger.debug('Session created in Firestore', { sessionId });
    } catch (err) {
      logger.warn('Firestore write failed — falling back to in-memory', { sessionId });
      inMemoryStore.set(sessionId, session);
    }
  } else {
    inMemoryStore.set(sessionId, session);
    logger.debug('Session created in memory', { sessionId });
  }

  return session;
}

/**
 * Appends a new message to an existing chat session.
 * Creates the session if it does not already exist.
 *
 * @param sessionId - The session to append the message to
 * @param message - The ChatMessage to save
 */
export async function saveMessage(sessionId: string, message: ChatMessage): Promise<void> {
  if (isFirestoreAvailable()) {
    try {
      const db = admin.firestore();
      const ref = db.collection('sessions').doc(sessionId);
      const doc = await ref.get();

      if (!doc.exists) {
        await createSession(sessionId);
      }

      await ref.update({
        messages: admin.firestore.FieldValue.arrayUnion(message),
        updatedAt: Date.now(),
      });
    } catch (err) {
      // Firestore write failed — persist in memory so chat continues working
      logger.warn('Firestore saveMessage failed — using in-memory fallback', { sessionId });
      const session = inMemoryStore.get(sessionId);
      if (session) {
        session.messages.push(message);
        session.updatedAt = Date.now();
      } else {
        const newSession = await createSession(sessionId);
        newSession.messages.push(message);
      }
    }
  } else {
    const session = inMemoryStore.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = Date.now();
    } else {
      const newSession = await createSession(sessionId);
      newSession.messages.push(message);
    }
  }
}

/**
 * Retrieves the full message history for a given session.
 *
 * @param sessionId - The session ID to fetch history for
 * @returns Array of ChatMessage objects, or empty array if session not found
 */
export async function getHistory(sessionId: string): Promise<ChatMessage[]> {
  if (isFirestoreAvailable()) {
    try {
      const db = admin.firestore();
      const doc = await db.collection('sessions').doc(sessionId).get();
      if (!doc.exists) return [];
      const data = doc.data() as FirestoreSession;
      return data.messages ?? [];
    } catch (err) {
      logger.warn('Firestore getHistory failed — checking in-memory store', { sessionId });
    }
  }

  return inMemoryStore.get(sessionId)?.messages ?? [];
}
