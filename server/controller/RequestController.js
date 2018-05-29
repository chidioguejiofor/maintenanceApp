import requestService from '../services/requestService';
import RequestValidator from '../validators/RequestValidator';
import Controller from './Controller';

function getRequest(body) {
  const request = {
    title: body.title,
    description: body.description,
    image: body.image,
    location: body.location,
  };
  const validationResult = new RequestValidator(request).validate();
  return { request, validationResult };
}


function getStatus(status) {
  const regex = /approve|disapprove|resolve/i;
  if (regex.test(status)) return `${status}d`;
  return false;
}


export default class RequestController extends Controller {
  static modify(req, resp) {
    const { request, validationResult } = getRequest(req.body);
    const { params: { id } } = req;
    if (!RequestController.verifyUser(req, resp, 'client')) return;
    if (validationResult.valid) {
      const user = req.authData.client;
      requestService.modify(user.username, request, id, (result) => {
        resp.status(result.statusCode).json(result.respObj);
      });
    } else {
      resp.status(400).json(RequestValidator.handleBadData(validationResult));
    }
  }

  static getStats(req, resp) {
    if (!RequestController.verifyUser(req, resp, 'engineer')) return;
    requestService.getStatistics((result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }
  static create(req, resp) {
    const { request, validationResult } = getRequest(req.body, req.authData.client.username);
    if (!RequestController.verifyUser(req, resp, 'client')) return;
    if (validationResult.valid) {
      request.clientUsername = req.authData.client.username;
      requestService.makeRequest(request, (result) => {
        resp.status(result.statusCode).json(result.respObj);
      });
    } else {
      resp.status(400).json(RequestValidator.handleBadData(validationResult));
    }
  }


  static getAllClientRequests(req, resp) {
    if (!RequestController.verifyUser(req, resp, 'client')) return;
    requestService.getByUsername(req.authData.client.username, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }

  static getAll(req, resp) {
    if (!RequestController.verifyUser(req, resp, 'engineer')) return;
    requestService.getAll((result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }


  static getById(req, resp) {
    if (!RequestController.verifyUser(req, resp, 'client')) return;
    const { params: { id } } = req;
    requestService.getById(req.authData.client.username, id, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }
  static updateStatus(req, resp) {
    const { params: { status, id } } = req;
    if (!RequestController.verifyUser(req, resp, 'engineer')) return;
    const statusValue = getStatus(status);

    if (statusValue) {
      requestService.updateStatus(statusValue, id, (result) => {
        resp.status(result.statusCode).json(result.respObj);
      });
    } else {
      resp.status(404).json({
        success: false,
        message: 'The route you specified is invalid',
      });
    }
  }
}

