import { Router } from 'express';
import authRouter from './v1/authRouter';
import requestRouter from './v1/requestRouter';

const apiV1Router = Router();

apiV1Router.use('/auth', authRouter);
apiV1Router.use('/users/requests', requestRouter);

export default apiV1Router;
