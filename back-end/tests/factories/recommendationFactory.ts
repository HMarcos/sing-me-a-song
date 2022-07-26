import {faker} from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";


function createValidRecommendationInfo() {
    const recommendation: CreateRecommendationData = {
        name: faker.music.songName(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric()}`
    };

    return recommendation;
};

async function createRecommendation(recommendation: CreateRecommendationData) {
    await recommendationRepository.create(recommendation);
};

const recommendationFactory = {
    createValidRecommendationInfo,
    createRecommendation
};

export default recommendationFactory;