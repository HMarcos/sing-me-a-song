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

async function createScenarioWithManyRecommendations(
  maxScore: number = 1000,
  amount: number = 30,
  orderBy: 'id' | 'score' = 'id'
) {
  const recommendationsData = [];
  for (let i = 0; i < amount; i++) {
    const recommendation =
      recommendationFactory.createValidRecommendationInfoWithScore(maxScore);
    recommendationsData.push(recommendation);
  }

  await prisma.recommendation.createMany({
    data: recommendationsData,
    skipDuplicates: true,
  });

  let recommendations = [];

  if (orderBy === 'id') {
    recommendations = await prisma.recommendation.findMany({
      orderBy: { id: 'desc' },
    });
  } else {
    recommendations = await prisma.recommendation.findMany({
      orderBy: { score: 'desc' },
    });
  }

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
  createScenarioWithManyRecommendations,
  deleteAllData,
};

export default scenarioFactory;
