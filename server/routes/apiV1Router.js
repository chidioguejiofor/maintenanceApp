import { Router } from 'express';
import authRouter from './v1/authRouter';
import requestRouter from './v1/requestRouter';

const apiV1Router = Router();
apiV1Router.use((req, resp, next) => {
  resp.header('Access-Control-Allow-Origin', '*');
  resp.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  resp.header('Access-Control-Allow-Headers', '*');
  next();
});
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/', requestRouter);

export default apiV1Router;
