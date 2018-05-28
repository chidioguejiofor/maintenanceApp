import requestService from '../services/requestService';
import RequestValidator from '../validators/RequestValidator';


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

function verifyUser(req, resp, userType) {
  if (!req.authData[userType]) {
    resp.status(403).json({
      success: false,
      message: `Only ${userType}(s) can make a request`,
    });
    return false;
  }
  return true;
}
export default class RequestController {
  static modify(req, resp) {
    const { request, validationResult } = getRequest(req.body);
    const { params: { id } } = req;
    if (!verifyUser(req, resp, 'client')) return;
    if (validationResult.valid) {
      const user = req.authData.client;
      requestService.modify(user.username, request, id, (result) => {
        resp.status(result.statusCode).json(result.respObj);
      });
    } else {
      resp.status(400).json(RequestValidator.handleBadData(validationResult));
    }
  }
  static create(req, resp) {
    const { request, validationResult } = getRequest(req.body, req.authData.client.username);
    if (!verifyUser(req, resp, 'client')) return;
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
    if (!verifyUser(req, resp, 'client')) return;
    requestService.getByUsername(req.authData.client.username, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }

  static getAll(req, resp) {
    if (!verifyUser(req, resp, 'engineer')) return;
    requestService.getAll((result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }


  static getById(req, resp) {
    if (!verifyUser(req, resp, 'client')) return;
    const { params: { id } } = req;
    requestService.getById(req.authData.client.username, id, (result) => {
      resp.status(result.statusCode).json(result.respObj);
    });
  }
  static updateStatus(req, resp) {
    const { params: { status, id } } = req;
    if (!verifyUser(req, resp, 'engineer')) return;
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

