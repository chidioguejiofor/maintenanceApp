import requestService from '../services/requestService';
import RequestValidator from '../validators/RequestValidator';
import Request from '../models/Request';


function getRequest(body) {
  const {
    title, description, clientId, image, location,
  } = body;
  const request = new Request(title, description, location, clientId, image);
  const validationResult = new RequestValidator(request).validate();
  return { request, validationResult };
}

export default class RequestController {
  static create(req, resp) {
    const { request, validationResult } = getRequest(req.body);


    if (validationResult.valid) {
      const result = requestService.makeRequest(request);
      resp.status(result.statusCode).json(result.respObj);
    } else {
      resp.status(400).json({
        success: false,
        message: 'Some data inputed are invalid',
        invalidData: validationResult.invalidData,
      });
    }
  }

  static modify(req, resp) {
    const { request, validationResult } = getRequest(req.body);
    const { params: { id } } = req;
    if (validationResult.valid) {
      const response = requestService.modify(id, request);
      resp.json(response.statusCode).json(response.respObj);
    } else {
      resp.status(400).json({
        success: false,
        message: 'Some inputed data was invalid',
        invalidData: validationResult.invalidData,
      });
    }
  }

  static getById(req, resp) {
    const response = requestService.getById(req.id);
    resp.status(response.statusCode).json(response.respObj);
  }

  static getAll(req, resp) {
    const { username, password } = req.body;
    const response = requestService.getByCredentials(username, password);

    resp.status(response.statusCode).json(response.respObj);
  }
}

