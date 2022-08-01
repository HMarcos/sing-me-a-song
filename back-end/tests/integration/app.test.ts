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
    const recommendation = recommendationFactory.createValidRecommendationInfo();
    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(201);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(recommendationCreated).not.toBeNull();
  });

  it('Try to create a repeat recommendation - Error 409', async () => {
    const recommendation = recommendationFactory.createValidRecommendationInfo();
    await recommendationFactory.createRecommendation(recommendation);

    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(409);
  });

  it('Try to create with empty request body - Error 422', async () => {
    const response = await agent.post('/recommendations').send({});
    expect(response.status).toBe(422);
  });

  it('Try to create with invalid youtube link - Error 422', async () => {
    const recommendation = recommendationFactory.createValidRecommendationInfo();
    recommendation.youtubeLink = faker.internet.url();

    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(422);
  });
});
