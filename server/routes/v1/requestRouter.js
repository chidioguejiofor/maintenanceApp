import { Router } from 'express';
import RequestController from '../../controller/RequestController';

const requestRouter = Router();

requestRouter.post('/', RequestController.create);
requestRouter.get('/', RequestController.getAll);
requestRouter.get('/:id', RequestController.getById);
requestRouter.put('/:id', RequestController.modify);

export default requestRouter;
