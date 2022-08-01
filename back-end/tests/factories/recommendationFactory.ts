import { faker } from '@faker-js/faker';
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
  createValidRecommendationInfoWithScore,
  createRecommendation,
};

export default recommendationFactory;
