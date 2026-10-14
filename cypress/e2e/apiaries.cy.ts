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

// Needs the hives table from supabase/migrations/002_hives.sql.
describe('Hives', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('adds a hive to an apiary', () => {
    const apiaryName = `Hive test apiary ${Date.now()}`;

    cy.get('[data-testid="new-apiary-button"]').click();
    cy.get('[data-testid="apiary-name-input"]').type(apiaryName);
    cy.get('[data-testid="apiary-save-button"]').click();
    cy.contains('No hives yet').should('be.visible');

    cy.get('[data-testid="add-hive-button"]').click();
    cy.get('[data-testid="hive-save-button"]').click();
    cy.contains('Enter a name or number.').should('be.visible');

    cy.get('[data-testid="hive-name-input"]').type('Hive 1');
    cy.get('[data-testid="hive-type-langstroth"]').click();
    cy.get('[data-testid="hive-save-button"]').click();

    cy.contains('Hive 1').should('be.visible');
    cy.contains('Langstroth').should('be.visible');

    // add queen details by editing the hive; 2025 is marked blue
    cy.contains('Hive 1').click();
    cy.get('[data-testid="queen-year-input"]').type('2025');
    cy.get('[data-testid="queen-color-preview"]').should('contain', 'blue');
    cy.get('[data-testid="queen-breed-input"]').type('Buckfast');
    cy.get('[data-testid="queen-marked-toggle"]').click();
    cy.get('[data-testid="hive-save-button"]').click();
    cy.contains('Queen 2025 · Buckfast · marked').should('be.visible');

    // clean up
    cy.get('[data-testid="delete-apiary-button"]').click();
    cy.get('[data-testid="confirm-delete-button"]').click();
  });
});
