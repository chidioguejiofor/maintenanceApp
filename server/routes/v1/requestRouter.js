import { Router } from 'express';
import RequestController from '../../controller/RequestController';

const requestRouter = Router();

requestRouter.post('/', RequestController.create);

requestRouter.get('/', RequestController.getAll);
requestRouter.get('/:requestId', RequestController.getById);
requestRouter.puts('/:requestId', RequestController.modify);

