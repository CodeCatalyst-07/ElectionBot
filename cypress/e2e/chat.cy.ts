/**
 * Cypress E2E test for the main chat flow.
 *
 * Pre-conditions:
 *   - Both client (port 5173) and server (port 8080) must be running.
 *   - GEMINI_API_KEY must be set in server/.env.
 *
 * This test covers:
 *   1. Landing on the homepage
 *   2. Navigating to the /chat page
 *   3. Typing an election question
 *   4. Submitting and waiting for the AI response
 *   5. Verifying the response appears and is non-empty
 */
describe('Election Chatbot — Main Chat Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the homepage hero section with correct heading', () => {
    cy.get('h1').should('contain.text', 'Elections');
    cy.get('a[aria-label="Start chatting with ElectionBot AI"]').should('be.visible');
  });

  it('navigates to the chat page via nav link', () => {
    cy.get('a[href="/chat"]').first().click();
    cy.url().should('include', '/chat');
    cy.get('[aria-label="Chat with ElectionBot"]').should('exist');
  });

  it('shows suggested questions on empty chat state', () => {
    cy.visit('/chat');
    cy.get('[aria-label^="Ask:"]').should('have.length.at.least', 4);
  });

  it('sends a chat message and receives an AI response', () => {
    cy.visit('/chat');

    const question = 'What is voter registration in India?';

    // Type the question
    cy.get('textarea[aria-label="Type your election question"]')
      .type(question);

    // Submit via Enter key
    cy.get('textarea[aria-label="Type your election question"]')
      .type('{enter}');

    // User message should appear
    cy.get('[aria-label*="You:"]').should('contain.text', question);

    // Wait for the AI response (up to 20 seconds)
    cy.get('[aria-label*="ElectionBot:"]', { timeout: 20000 }).should('exist');
    cy.get('[aria-label*="ElectionBot:"]').invoke('text').should('have.length.above', 20);
  });

  it('activates first-time voter mode via the toggle button', () => {
    cy.visit('/chat');

    cy.get('button[aria-label*="Toggle first-time voter mode"]')
      .should('have.attr', 'aria-pressed', 'false')
      .click()
      .should('have.attr', 'aria-pressed', 'true');
  });

  it('opens and closes the accessibility panel', () => {
    cy.get('button[aria-label*="Open accessibility settings panel"]').click();
    cy.get('[role="dialog"][aria-label="Accessibility settings"]').should('be.visible');

    cy.get('button[aria-label*="Close accessibility settings panel"]').click();
    cy.get('[role="dialog"][aria-label="Accessibility settings"]').should('not.exist');
  });

  it('navigates to the quiz page and shows 10 questions progression', () => {
    cy.get('a[href="/quiz"]').first().click();
    cy.url().should('include', '/quiz');
    cy.get('[role="progressbar"]').should('exist');
    cy.get('h2').should('contain.text', 'Question 1 of 10');
  });
});
