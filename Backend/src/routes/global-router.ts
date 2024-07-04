import { Router } from 'express';
import authRouter from './auth/auth-router';
import pptxRouter from './pptx/pptx-router';

const globalRouter = Router();

globalRouter.use('/auth',authRouter);
globalRouter.use('/pptx',pptxRouter);

export default globalRouter;
