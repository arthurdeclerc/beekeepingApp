describe('Login screen', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('renders the login form', () => {
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
    cy.get('[data-testid="login-button"]').should('exist');
  });

  it('shows validation errors for empty fields', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Enter a valid email address.').should('be.visible');
    cy.contains('Enter your password.').should('be.visible');
  });

  it('shows a generic error for wrong credentials', () => {
    cy.get('[data-testid="email-input"]').type('nobody@example.com');
    cy.get('[data-testid="password-input"]').type('wrong-password');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-error"]').should('contain', 'Incorrect email or password.');
  });

  it('redirects unauthenticated users from the home screen to login', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('logs in with valid credentials and navigates to home', () => {
    // Provide a Supabase test user: CYPRESS_TEST_EMAIL / CYPRESS_TEST_PASSWORD
    // `as string`: Cypress.env() returns any; the values are required to run this test.
    const testEmail = Cypress.env('TEST_EMAIL') as string;
    const testPassword = Cypress.env('TEST_PASSWORD') as string;

    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('not.include', '/login');
  });
});
