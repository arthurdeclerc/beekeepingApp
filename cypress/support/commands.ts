declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in through the login screen with CYPRESS_TEST_EMAIL / CYPRESS_TEST_PASSWORD. */
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  // `as string`: Cypress.env() returns any; the test user is required to run these tests.
  const email = Cypress.env('TEST_EMAIL') as string;
  const password = Cypress.env('TEST_PASSWORD') as string;

  cy.session(
    [email],
    () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="new-apiary-button"]').should('exist');
    },
    {
      validate: () => {
        cy.visit('/');
        cy.url().should('not.include', '/login');
      },
    },
  );
});

export {};
