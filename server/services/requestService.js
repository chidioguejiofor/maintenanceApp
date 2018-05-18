import uuid from 'uuid';

class RequestService {
  constructor() {
    this.requests = [];
  }

  /**
   * This checks if the specified id exists in the system and returns an object
   * with success === true
   * @param {uuid} requestId
   */
  getById(requestId) {
    const request =
        this.requests
          .find(existingRequest => existingRequest.id === requestId);

    if (request) {
      return {
        success: true,
        statusCode: 200,
        data: request,
      };
    }
    return {
      succes: false,
      statusCode: 404,
      message: 'The specified id was not found',
    };
  }

  getAll() {
    const { requests } = this;
    if (requests.length >= 0) {
      return {
        statusCode: 200,
        respObj: requests,
      };
    }
    return {
      statusCode: 204,
    };
  }

  /**
   * This gets all the requests made by a client specified by the
   * clientID
   * @param {*} clientId
   */
  getByUserId(clientId) {
    const requestArr =
    this.requests.filter(existingRequest =>
      existingRequest.clientId === clientId);
    if (requestArr.length > 0) {
      return {
        respObj: {
          success: true,
          data: requestArr,
        },
        statusCode: 200,
      };
    }
    return {
      respObj: {
        success: false,
        message: 'The specified clientID does not exist',
      },
      statusCode: 404,
    };
  }


  makeRequest(request) {
    request.id = uuid.v4();
    this.requests.push(request);
    return {
      statusCode: 201,
      respObj: {
        success: true,
        data: request,
      },
    };
  }

  modify(requestId, newRequest) {
    const requestIndex =
         this.requests
           .findIndex(existing =>
             existing.id === requestId);

    if (requestIndex >= 0) {
      const finalObj = Object.assign({}, newRequest);
      finalObj.id = requestId;
      this.requests[requestId] = finalObj;

      return {
        statusCode: 200,
        respObj: {
          success: true,
          data: finalObj,
        },

      };
    }
    return {
      respObj: {
        success: false,
        message: 'The id was not found',
      },
      statusCode: 404,
    };
  }
}

export default new RequestService();
