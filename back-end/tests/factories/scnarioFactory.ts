import { prisma } from '../../src/database.js';
import recommendationFactory, {
  CreateRecommendationDataWithScore,
} from './recommendationFactory.js';

async function createScenarioWithInitialDefaultRecommendation() {
  const recommendationInfo =
    recommendationFactory.createValidRecommendationInfo();
  const recommendation = await recommendationFactory.createRecommendation(
    recommendationInfo
  );
  return recommendation;
}

async function createScenarioWithRecommendationScoreOfMinusFive() {
  const recommendationInfo =
    recommendationFactory.createValidRecommendationInfo();
  const recommendationWithMinusFiveScore = {
    name: recommendationInfo.name,
    youtubeLink: recommendationInfo.youtubeLink,
    score: -5,
  } as CreateRecommendationDataWithScore;

  const recommendation = await recommendationFactory.createRecommendation(
    recommendationWithMinusFiveScore
  );
  return recommendation;
}

async function createScnarioWithManyRecommendations() {
  const recommendationsData = [];
  for (let i = 0; i < 30; i++) {
    const recommendation =
      recommendationFactory.createValidRecommendationInfo();
    recommendationsData.push(recommendation);
  }

  await prisma.recommendation.createMany({
    data: recommendationsData,
    skipDuplicates: true,
  });

  const recommendations = await prisma.recommendation.findMany({
    orderBy: { id: 'desc' },
  });

  return recommendations;
}

async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations`,
  ]);
}

const scenarioFactory = {
  createScenarioWithInitialDefaultRecommendation,
  createScenarioWithRecommendationScoreOfMinusFive,
  createScnarioWithManyRecommendations,
  deleteAllData,
};

export default scenarioFactory;
