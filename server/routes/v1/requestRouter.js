import { Router } from 'express';
import RequestController from '../../controller/RequestController';
import authenticator from '../../helpers/authenticator';

const requestRouter = Router();
requestRouter.use(authenticator.verifyToken);

requestRouter.post('/users/requests', RequestController.create);
requestRouter.get('/users/requests', RequestController.getAllClientRequests);
requestRouter.get('/users/requests/:id', RequestController.getById);
requestRouter.get('/requests/', RequestController.getAll);
export default requestRouter;
