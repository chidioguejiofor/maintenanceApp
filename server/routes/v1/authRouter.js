import { Router } from 'express';
import UserController from '../../controller/UserController';

const authRouter = Router();

authRouter.post('/login', UserController.login);

authRouter.post('/signup', UserController.makeSignupRequest);
authRouter.post('/signup/:token', UserController.signup);
authRouter.post('/reset', UserController.reset);
authRouter.post('/reset/:token', UserController.acceptReset);

export default authRouter;
