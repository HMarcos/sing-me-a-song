import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { recommendationService } from '../../src/services/recommendationsService.js';
import recommendationFactory from '../factories/recommendationFactory.js';

jest.mock('../../src/repositories/recommendationRepository');

beforeEach(() => {
  jest.clearAllMocks();
  //jest.resetAllMocks();
});

describe('getRandom service test suite', () => {
  it('Return a song with a score greater than 10 - 70% of cases', async () => {
    const recommendations = [
      recommendationFactory.createRecommendationInfo(1000, 10),
      recommendationFactory.createRecommendationInfo(9, -5),
    ];

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    jest.spyOn(Math, 'floor').mockReturnValueOnce(0);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recommendations[0]]);

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'gt',
    });
    expect(result).toEqual(recommendations[0]);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });

  it('Case with all songs with a score less than 10 and random value equal 0.5', async () => {
    const maxScore = 9;
    const minScore = -5;
    const recommendations = [
      recommendationFactory.createRecommendationInfo(maxScore, minScore),
      recommendationFactory.createRecommendationInfo(maxScore, minScore),
    ];

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    jest.spyOn(Math, 'floor').mockReturnValueOnce(0);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]).mockResolvedValueOnce(recommendations);

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(1, {
      score: 10,
      scoreFilter: 'gt',
    });
    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(2);
    expect(result).toEqual(recommendations[0]);
    expect(result.score).toBeLessThan(10);
  });

  it('Return a song with a score less than 10 - 30% of cases', async () => {
    const recommendations = [
      recommendationFactory.createRecommendationInfo(1000, 10),
      recommendationFactory.createRecommendationInfo(9, -5),
    ];

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);
    jest.spyOn(Math, 'floor').mockReturnValueOnce(0);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recommendations[1]]);

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalledWith({
      score: 10,
      scoreFilter: 'lte',
    });
    expect(result).toEqual(recommendations[1]);
    expect(result.score).toBeLessThan(10);
  });

  it('Case with all songs with a score greater than 10 and random value equal 0.8', async () => {
    const maxScore = 1000;
    const minScore = 10;
    const recommendations = [
      recommendationFactory.createRecommendationInfo(maxScore, minScore),
      recommendationFactory.createRecommendationInfo(maxScore, minScore),
    ];

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);
    jest.spyOn(Math, 'floor').mockReturnValueOnce(0);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]).mockResolvedValueOnce(recommendations);

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(1, {
      score: 10,
      scoreFilter: 'lte',
    });
    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(2);
    expect(result).toEqual(recommendations[0]);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });

  it('Database without musics', async () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);
    jest.spyOn(Math, 'floor').mockReturnValueOnce(0);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    const promise = recommendationService.getRandom();
    await expect(promise).rejects.toEqual({
      type: 'not_found',
      message: '',
    });

    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(1, {
      score: 10,
      scoreFilter: 'lte',
    });
    expect(recommendationRepository.findAll).toHaveBeenNthCalledWith(2);
  });
});

describe('insert recommendation service test suite', () => {
  it('Insert a valid recommendation', async () => {
    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(undefined);
    jest.spyOn(recommendationRepository, 'create').mockImplementationOnce((): any => {});

    const recommendation = recommendationFactory.createValidRecommendationInfo();
    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toHaveBeenCalledWith(recommendation.name);
    expect(recommendationRepository.create).toHaveBeenCalledWith(recommendation);
  });

  it('Rejects to insert a recommendation', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo();
    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(registeredRecommendation);

    const newRecommendation = recommendationFactory.createValidRecommendationInfo();
    const promise = recommendationService.insert(newRecommendation);

    await expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique',
    });
    expect(recommendationRepository.findByName).toHaveBeenCalledWith(newRecommendation.name);
  });
});

describe('upvote recommendation service test suite', () => {
  it('Upvote a recommendation', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo();
    
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(registeredRecommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {});

    await recommendationService.upvote(registeredRecommendation.id);

    expect(recommendationRepository.find).toHaveBeenCalledWith(registeredRecommendation.id);
    expect(recommendationRepository.updateScore).toHaveBeenCalledWith(registeredRecommendation.id, 'increment');
  });

  it('Rejects to upvote a recommendation', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo();
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

    const promise = recommendationService.upvote(registeredRecommendation.id);

    await expect(promise).rejects.toEqual({
      type: 'not_found',
      message: '',
    });
    expect(recommendationRepository.find).toHaveBeenCalledWith(registeredRecommendation.id);
  });
});

describe('downvote recommendation service test suite', () => {
  it('Downvote a recommendation', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo(10, 1);

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(registeredRecommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
      const updatedScore = registeredRecommendation.score - 1;
      const updatedRecommendation = { ...registeredRecommendation, score: updatedScore };
      return updatedRecommendation;
    });

    await recommendationService.downvote(registeredRecommendation.id);

    expect(recommendationRepository.find).toHaveBeenCalledWith(registeredRecommendation.id);
    expect(recommendationRepository.updateScore).toHaveBeenCalledWith(registeredRecommendation.id, 'decrement');
  });

  it('Downvote and exclude recommendation - Score less than -5', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo(-5, -5);

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(registeredRecommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
      const updatedScore = registeredRecommendation.score - 1;
      const updatedRecommendation = { ...registeredRecommendation, score: updatedScore };
      return updatedRecommendation;
    });
    jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => {});

    await recommendationService.downvote(registeredRecommendation.id);

    expect(recommendationRepository.find).toHaveBeenCalledWith(registeredRecommendation.id);
    expect(recommendationRepository.updateScore).toHaveBeenCalledWith(registeredRecommendation.id, 'decrement');
    expect(recommendationRepository.remove).toHaveBeenCalledWith(registeredRecommendation.id);
  });

  it('Rejects to upvote a recommendation', async () => {
    const registeredRecommendation = recommendationFactory.createRecommendationInfo();
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

    const promise = recommendationService.downvote(registeredRecommendation.id);

    await expect(promise).rejects.toEqual({
      type: 'not_found',
      message: '',
    });
    expect(recommendationRepository.find).toHaveBeenCalledWith(registeredRecommendation.id);
  });
});
