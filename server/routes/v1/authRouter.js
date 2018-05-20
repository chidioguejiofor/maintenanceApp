import { Router } from 'express';

import UserController from '../../controller/UserController';

const authRouter = Router();

authRouter.post('/login', UserController.login);
authRouter.post('/signup', UserController.signup);

export default authRouter;
