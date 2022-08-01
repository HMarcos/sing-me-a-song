/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

beforeEach(() => {
  cy.resetRecommendations();
});

describe('Create a recommendation test suite', () => {
  it('should create a new recommendation', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);

    cy.contains(`${recommendation.name}`).should('be.visible');
  });

  it('try to create a duplicated recommendation', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.createRecommendation(recommendation);

    cy.on('window:alert', (content) => {
      expect(content).to.contains('Error creating recommendation');
    });
  });

  it('try to create a recommendation with invalid link', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.tenisbrasil.com.br',
    };

    cy.createRecommendation(recommendation);

    cy.on('window:alert', (content) => {
      expect(content).to.contains('Error creating recommendation');
    });
  });
});

afterEach(() => {
  cy.resetRecommendations();
});
