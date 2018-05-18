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


  /**
   * This gets all the requests made by a client specified by the
   * clientID
   * @param {*} clientID
   */
  getByCredentials(clientID) {
    const request =
    this.requests.filter(existingRequest =>
      existingRequest.clientId === clientID);
    if (request) {
      return {
        success: true,
        data: request,
        statusCode: 200,
      };
    }
    return {
      success: false,
      message: 'The specified request does not exist',
      statusCode: 404,
    };
  }


  makeRequest(request) {
    request.id = uuid.v4();
    this.requests.push(request);
    return {
      success: true,
      data: request,
      statusCode: 201,
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
        success: true,
        data: finalObj,
      };
    }
    return {
      success: false,
      message: 'The id was not found',
      statusCode: 404,
    };
  }
}

export default new RequestService();
