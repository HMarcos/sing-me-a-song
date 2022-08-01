import { Request, Response } from 'express';
import { recommendationService } from '../services/recommendationsService.js';

async function deleteAll(req: Request, res: Response) {
  await recommendationService.removeAll();
  res.sendStatus(200);
}

export const e2eTestsController = {
  deleteAll,
};
