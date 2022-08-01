const APP_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000';

Cypress.Commands.add('resetRecommendations', () => {
  cy.request('DELETE', `${API_URL}/recommendations/reset`);
});

Cypress.Commands.add('createRecommendation', (recommendation) => {
  cy.visit(`${APP_URL}/`);
  cy.get('#name').type(recommendation.name);
  cy.get('#youtubeLink').type(recommendation.youtubeLink);

  cy.intercept('POST', '/recommendations').as('postRecommendation');
  cy.get('#submit').click();
  cy.wait('@postRecommendation');
});
