// Needs a Supabase test user and the database from supabase/migrations/001_apiaries.sql.
// Run with: CYPRESS_TEST_EMAIL=... CYPRESS_TEST_PASSWORD=... npm run cypress:run
describe('Apiaries', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('shows the apiary list with a button to add one', () => {
    cy.get('[data-testid="new-apiary-button"]').should('be.visible');
  });

  it('asks for a name before saving', () => {
    cy.get('[data-testid="new-apiary-button"]').click();
    cy.get('[data-testid="apiary-save-button"]').click();
    cy.contains('Enter a name.').should('be.visible');
  });

  it('creates, edits and deletes an apiary', () => {
    const name = `Test apiary ${Date.now()}`;
    const renamed = `${name} (edited)`;

    // create
    cy.get('[data-testid="new-apiary-button"]').click();
    cy.get('[data-testid="apiary-name-input"]').type(name);
    cy.get('[data-testid="apiary-address-input"]').type('Hoogstraat 12, Leuven');
    cy.get('[data-testid="apiary-notes-input"]').type('Created by Cypress');
    cy.get('[data-testid="apiary-save-button"]').click();

    // lands on the new apiary, as its owner
    cy.get('[data-testid="apiary-detail-name"]').should('contain', name);
    cy.contains('Owner').should('be.visible');

    // edit
    cy.get('[data-testid="edit-apiary-button"]').click();
    cy.get('[data-testid="apiary-name-input"]').clear().type(renamed);
    cy.get('[data-testid="apiary-save-button"]').click();
    cy.get('[data-testid="apiary-detail-name"]').should('contain', renamed);

    // delete needs a confirmation step
    cy.get('[data-testid="delete-apiary-button"]').click();
    cy.get('[data-testid="delete-confirm"]').should('be.visible');
    cy.get('[data-testid="confirm-delete-button"]').click();

    // back on the list, apiary is gone
    cy.get('[data-testid="new-apiary-button"]').should('be.visible');
    cy.contains(renamed).should('not.exist');
  });
});
