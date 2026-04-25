import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled Cloud Function that runs every Sunday at midnight UTC.
 * Deletes chat sessions older than 30 days to keep Firestore clean and costs low.
 */
export const cleanupOldSessions = functions.pubsub
  .schedule('every sunday 00:00')
  .timeZone('UTC')
  .onRun(async (): Promise<null> => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const oldSessionsQuery = db
      .collection('sessions')
      .where('updatedAt', '<', thirtyDaysAgo);

    const snapshot = await oldSessionsQuery.get();

    if (snapshot.empty) {
      functions.logger.info('No old sessions to clean up.');
      return null;
    }

    // Batch delete for efficiency (max 500 per batch)
    const BATCH_SIZE = 500;
    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = docs.slice(i, i + BATCH_SIZE);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    functions.logger.info(`Cleaned up ${docs.length} old chat sessions.`, {
      count: docs.length,
    });

    return null;
  });

/**
 * Firestore trigger that logs whenever a new chat session is created.
 * Useful for analytics and monitoring active user counts.
 */
export const onNewSession = functions.firestore
  .document('sessions/{sessionId}')
  .onCreate((snapshot, context): null => {
    const data = snapshot.data();
    functions.logger.info('New chat session started', {
      sessionId: context.params['sessionId'],
      createdAt: data?.['createdAt'] as number,
    });
    return null;
  });
