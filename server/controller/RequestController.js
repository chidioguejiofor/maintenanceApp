import requestService from '../services/requestService';
import RequestValidator from '../validators/RequestValidator';


function getRequest(body) {
  const {
    title, description, image, location,
  } = body;
  const request = {
    title, description, image, location,
  };
  const validationResult = new RequestValidator(request).validate();
  return { request, validationResult };
}


export default class RequestController {
  static create(req, resp) {
    if (!req.authData.client) {
      resp.status(403).json({
        success: false,
        message: 'Only users(clients) can make a request',
      });
      return;
    }
    const { request, validationResult } = getRequest(req.body, req.authData.client.username);

    if (validationResult.valid) {
      request.clientUsername = req.authData.client.username;
      requestService.makeRequest(request, (result) => {
        resp.status(result.statusCode).json(result.respObj);
      });
    } else {
      resp.status(400).json(RequestValidator.handleBadData(validationResult));
    }
  }

  static modify(req, resp) {
    const { request, validationResult } = getRequest(req.body);
    const { params: { id } } = req;
    if (validationResult.valid) {
      const response = requestService.modify(id, request);
      resp.status(response.statusCode).json(response.respObj);
    } else {
      resp.status(400).json(RequestValidator.handleBadData(validationResult));
    }
  }


  static getAll(req, resp) {
    requestService.getAll((result) => {
      console.log(result, 'result');
      resp.status(result.statusCode).json(result.respObj);
    });
  }

  static getByUsername(req, resp) {
    const { body: { username } } = req;
    requestService.getByUsername(username, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }

  static getById(req, resp) {
    const { body: { username }, params: { id } } = req;
    requestService.getById(username, id, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }
}

