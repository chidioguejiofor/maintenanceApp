
import { ReqeustMapper } from '../database/TableMappers';


function handleGetRequests(rows, callback) {
  console.log(callback, 'callback');
  if (rows.length > 0) {
    callback({
      statusCode: 200,
      respObj: {
        success: true,
        data: rows,
      },
    });
  } else {
    callback({
      statusCode: 204,
    });
  }
}

function errorHandler(error, callback) {
  console.log(error);
  callback({
    statusCode: 500,
    message: 'Unknown error occured. Please check your parameters and try again',
  });
}
class RequestService {
  static getByUsername(clientUsername, callback) {
    ReqeustMapper.getByUsername(clientUsername, (result) => {
      handleGetRequests(result.rows, callback);
    }, (error) => {
      console.log(error);
      errorHandler(error, callback);
    });
  }

  static getAll(callback) {
    ReqeustMapper.getAll((result) => {
      console.log(result, 'result');
      handleGetRequests(result.rows, callback);
    }, (error) => {
      console.log(error);
      callback({
        statusCode: 400,
        respObj: {
          success: false,
          message: 'Unknown error',
        },
      });
    });
  }

  /**
   * Gets a specific request made by a client specified by the using the clientUsername
   * and requestId
   * @param {string} clientUsername the clientUsername in the reques
   * @param {string} requestId the id of the request
   */
  static getById(clientUsername, requestId, callback) {
    ReqeustMapper.getById(clientUsername, requestId, (result) => {
      handleGetRequests(result.rows, callback);
    }, errorHandler(errorHandler));
  }


  static makeRequest(request, callback) {
    const mapperObj = new ReqeustMapper(request);
    mapperObj.create((result) => {
      console.log(result, 'result');
      if (result.rowCount === 1) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
          },
        });
      }
    }, (error) => {
      console.log(error);
      callback({
        statusCode: 400,
        respObj: {
          success: false,
          message: 'Unknown error',
        },
      });
    });
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
        statusCode: 201,
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

export default RequestService;
