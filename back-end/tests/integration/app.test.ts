import supertest from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../../src/app.js';
import { prisma } from '../../src/database.js';
import recommendationFactory from '../factories/recommendationFactory.js';
import scenarioFactory from '../factories/scnarioFactory.js';

beforeEach(async () => {
  await scenarioFactory.deleteAllData();
});

const agent = supertest(app);

describe('Tests for creating new recommendations.', () => {
  it('Create a valid recommendation', async () => {
    const recommendation =
      recommendationFactory.createValidRecommendationInfo();
    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(201);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(recommendationCreated).not.toBeNull();
  });

  it('Try to create a repeat recommendation - Error 409', async () => {
    const recommendation =
      await scenarioFactory.createScenarioWithInitialDefaultRecommendation();
    const recommendationRequestData = {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    };

    const response = await agent
      .post('/recommendations')
      .send(recommendationRequestData);
    expect(response.status).toBe(409);
  });

  it('Try to create with empty request body - Error 422', async () => {
    const response = await agent.post('/recommendations').send({});
    expect(response.status).toBe(422);
  });

  it('Try to create with invalid youtube link - Error 422', async () => {
    const recommendation =
      recommendationFactory.createValidRecommendationInfo();
    recommendation.youtubeLink = faker.internet.url();

    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(422);
  });
});

describe('Upvote recommendations', () => {
  it('Should increment the recommendation score by 1', async () => {
    const recommendation =
      await scenarioFactory.createScenarioWithInitialDefaultRecommendation();
    const { id } = recommendation;
    const response = await agent.post(`/recommendations/${id}/upvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id },
    });
    expect(updatedRecommendation.score).toBe(recommendation.score + 1);
    expect(updatedRecommendation.score).toBe(1);
  });

  it('Try to upvote a non-existent recommendation ', async () => {
    const response = await agent.post(
      `/recommendations/${faker.random.numeric(3)}/upvote`
    );
    expect(response.status).toBe(404);
  });
});

describe('Downvote recommendations', () => {
  it('Should decrement the recommendation score by 1', async () => {
    const recommendation =
      await scenarioFactory.createScenarioWithInitialDefaultRecommendation();
    const { id } = recommendation;
    const response = await agent.post(`/recommendations/${id}/downvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id },
    });
    expect(updatedRecommendation.score).toBe(recommendation.score - 1);
    expect(updatedRecommendation.score).toBe(-1);
  });

  it('Should decrement the recommendation score by 1 and delete the recommendation (score below -5)', async () => {
    const recommendation =
      await scenarioFactory.createScenarioWithRecommendationScoreOfMinusFive();
    const { id } = recommendation;
    const response = await agent.post(`/recommendations/${id}/downvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id },
    });
    expect(updatedRecommendation).toBeNull();
  });

  it('Try to downvote a non-existent recommendation ', async () => {
    const response = await agent.post(
      `/recommendations/${faker.random.numeric(3)}/downvote`
    );
    expect(response.status).toBe(404);
  });
});

describe('Get the last 10 recommendations', () => {
  it('Checks if the last 10 registered recommendations are being sent', async () => {
    const recommendations =
      await scenarioFactory.createScnarioWithManyRecommendations();
    const lastTenRecommendations = recommendations.slice(0, 10);

    const response = await agent.get('/recommendations');
    const requestedRecommendations = response.body;

    expect(response.status).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body).toEqual(lastTenRecommendations);
  });
});

describe('Get a recommendation', () => {
  it('Get a valid recommendation', async () => {
    const recommendation =
      await scenarioFactory.createScenarioWithInitialDefaultRecommendation();
    const { id } = recommendation;
    const response = await agent.get(`/recommendations/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendation);
  });

  it('Try to get a non-existent recommendation', async () => {
    const response = await agent.get(
      `/recommendations/${faker.random.numeric(3)}`
    );
    expect(response.status).toBe(404);
  });
});
