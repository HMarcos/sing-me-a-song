import { Router } from 'express';
import { e2eTestsController } from '../controllers/e2eTestsController.js';

const e2eTestRouter = Router();

e2eTestRouter.delete('/reset', e2eTestsController.deleteAll);

export default e2eTestRouter;
