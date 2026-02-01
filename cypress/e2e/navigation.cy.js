describe('navigation', () => {
  it('navigates from sign in to sign up', () => {
    cy.visit('/');

    cy.getTestId('sign-up-button').click();

    cy.location('pathname').should('eq', '/signup');
    cy.getTestId('email-field').should('exist');
  });

  describe('drawer and stack navigation', () => {
    beforeEach(() => {
      cy.signIn();
      cy.intercept(
        'GET',
        'http://localhost:3000/todos?filter[status]=available&include=category',
        {fixture: 'todos/available.json'},
      );
      cy.intercept(
        'GET',
        'http://localhost:3000/todos?filter[status]=tomorrow&include=category',
        {fixture: 'todos/none.json'},
      );
      cy.intercept(
        'GET',
        'http://localhost:3000/todos/abc123?include=category',
        {fixture: 'todo/available.json'},
      );
      cy.intercept('GET', 'http://localhost:3000/categories?', {
        fixture: 'categories.json',
      });
      cy.intercept('GET', 'http://localhost:3000/categories/cat1?', {
        fixture: 'category.json',
      });
    });

    it('returns to the todo list using the back button', () => {
      cy.visit('/todos/available');

      cy.contains('Todo 1').click();
      cy.location('pathname').should('eq', '/todos/available/abc123');

      cy.getTestId('back-button').click();

      cy.location('pathname').should('eq', '/todos/available');
      cy.contains('Todo 1');
    });

    it('navigates to categories via the drawer and back from detail', () => {
      cy.visit('/todos/available');

      cy.getTestId('categories-nav-button').click();
      cy.location('pathname').should('eq', '/categories');

      cy.contains('Category C').click();
      cy.location('pathname').should('eq', '/categories/cat1');

      cy.getTestId('back-button').click();

      cy.location('pathname').should('eq', '/categories');
      cy.contains('Category C');
    });

    it('returns to the list when switching away from detail via the drawer', () => {
      cy.visit('/todos/available');

      cy.contains('Todo 1').click();
      cy.location('pathname').should('eq', '/todos/available/abc123');

      cy.getTestId('tomorrow-nav-button').click();
      cy.location('pathname').should('eq', '/todos/tomorrow');

      cy.getTestId('available-nav-button').click();

      cy.location('pathname').should('eq', '/todos/available');
      cy.contains('Todo 1');
    });
  });

  it('navigates to support and back from the about screen', () => {
    cy.visit('/about');

    cy.getTestId('support-button').click();
    cy.location('pathname').should('eq', '/about/support');

    cy.getTestId('back-button').click();

    cy.location('pathname').should('eq', '/about');
  });
});
