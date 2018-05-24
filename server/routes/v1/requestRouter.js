import { Router } from 'express';
import RequestController from '../../controller/RequestController';
import authenticator from '../../helpers/authenticator';

const requestRouter = Router();
requestRouter.use(authenticator.verifyToken);

requestRouter.post('/users/requests', RequestController.create);
requestRouter.get('/requests', RequestController.getAll);
requestRouter.get('users/requests/:id', RequestController.getById);


export default requestRouter;
