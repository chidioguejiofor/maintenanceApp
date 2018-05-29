import { Router } from 'express';
import authenticator from '../../helpers/authenticator';
import UserController from '../../controller/UserController';

const authRouter = Router();

authRouter.post('/login', UserController.login);
authRouter.post('/signup', UserController.signup);
authRouter.post('/reset', UserController.reset);
authRouter.put('/reset', authenticator.verifyToken, UserController.acceptReset);

export default authRouter;
