import { Router } from 'express';
import RequestController from '../../controller/RequestController';
import authenticator from '../../helpers/authenticator';

const requestRouter = Router();
requestRouter.use(authenticator.verifyTokenMiddleware);

requestRouter.post('/users/requests', RequestController.create);
requestRouter.get('/users/requests', RequestController.getAllClientRequests);
requestRouter.get('/users/requests/date/:date', RequestController.getAllClientRequests);
requestRouter.put('/users/requests/:id', RequestController.modify);

requestRouter.get('/users/requests/:id', RequestController.userGetRequestById);

requestRouter.get('/requests/stats', RequestController.getStats);
requestRouter.get('/requests/:id', RequestController.getById);
requestRouter.get('/requests/', RequestController.getAll);
requestRouter.get('/requests/date/:date', RequestController.getAll);

requestRouter.put('/requests/:id/:status', RequestController.updateStatus);
export default requestRouter;
