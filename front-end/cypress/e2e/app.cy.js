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

describe('Up vote recommendation test suit', () => {
  it('should increment by 1 the score when upvote a recommendation', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.get('#upvote').click();
    cy.get('.score').should('contain.text', '1');
  });
});

describe('Down vote recommendation test suit', () => {
  it('should decrement by 1 the score when downvote a recommendation', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.get('#downvote').click();
    cy.get('.score').should('contain.text', '-1');
  });

  it('should decrement the score by 1 until -6 and exclude the recommendation', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.get('#downvote').click().click().click().click().click().click();

    cy.contains(`${recommendation.name}`).should('not.exist');
    cy.contains(`No recommendations yet! Create your own :)`).should(
      'be.visible'
    );
  });
});

describe('Get random recommendation test suite', () => {
  it('should return a random recommendation for user', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.contains('Random').click();
    cy.contains(`${recommendation.name}`).should('be.visible');
  });
});

describe('Get top recommendations test suite', () => {
  it('should return the top recommendations for user', () => {
    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=e6QhH3q-UJE',
    };

    cy.createRecommendation(recommendation);
    cy.contains('Top').click();
    cy.contains(`${recommendation.name}`).should('be.visible');
  });
});

afterEach(() => {
  cy.resetRecommendations();
});
