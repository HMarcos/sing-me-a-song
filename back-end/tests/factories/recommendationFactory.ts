import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';
import { prisma } from '../../src/database.js';
import { CreateRecommendationData } from '../../src/services/recommendationsService.js';

export type CreateRecommendationDataWithScore = CreateRecommendationData & {
  score: number;
};

function createValidRecommendationInfo() {
  const recommendation: CreateRecommendationData = {
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric()}`,
  };

  return recommendation;
}

function createRecommendationInfo(maxScore = 1000, minScore = -5) {
  const recommendation: Recommendation = {
    id: faker.datatype.number({ min: 1, max: 100 }),
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric()}`,
    score: faker.datatype.number({ min: minScore, max: maxScore }),
  };

  return recommendation;
}

function createValidRecommendationInfoWithScore(maxScore: number = 1000) {
  const recommendation: CreateRecommendationDataWithScore = {
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric()}`,
    score: faker.datatype.number({ max: maxScore }),
  };

  return recommendation;
}

async function createRecommendation(
  recommendation: CreateRecommendationData | CreateRecommendationDataWithScore
) {
  const createdRecommendation = await prisma.recommendation.create({
    data: recommendation,
  });
  return createdRecommendation;
}

const recommendationFactory = {
  createValidRecommendationInfo,
  createRecommendationInfo,
  createValidRecommendationInfoWithScore,
  createRecommendation,
};

export default recommendationFactory;
