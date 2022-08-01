import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import e2eTestRouter from './routers/e2eTestRouter.js';
import recommendationRouter from './routers/recommendationRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

const NODE_ENV = process.env.NODE_ENV || 'dev';

app.use('/recommendations', recommendationRouter);

if (NODE_ENV === 'test') {
  app.use('/recommendations', e2eTestRouter);
}

app.use(errorHandlerMiddleware);

export default app;
