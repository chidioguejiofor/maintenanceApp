
import ReqeustMapper from '../database/mappers/RequestMapper';
import mailManager from '../helpers/mailManager';
/**
 * This helper function aids the interpretation of all get requests in this
 * requestService. It calls the callback with a response object with appropriate
 * data.
 * @param {Array} rows
 * @param {Function} callback
 * @param {boolean}[ oneRow ]
 */
function handleGetRequests(rows, callback, oneRow) {
  let data;
  if (oneRow) [data] = rows;
  else {
    data = rows;
  }
  if (rows.length > 0) {
    callback({
      statusCode: 200,
      respObj: {
        success: true,
        data,
        message: 'Request retrieval succeeded',
      },
    });
  } else if (oneRow) {
    callback({
      statusCode: 404,
      respObj: {
        success: false,
        message: 'The data you requested for was not found',
      },
    });
  } else {
    callback({ statusCode: 204 });
  }
}

/**
 * This errorHandler is called when an error occurs in a request.
 * it uses the error to generate a response object and makes a call to the
 * callback function with the response object
 * @param {object} error the error object
 * @param {Function} callback called with a response object
 */
function errorHandler(error, callback) {
  if (+error.code === 23503) {
    callback({
      statusCode: 404,
      respObj: {
        success: false,
        message: 'The token you provided is invalid. Please recheck and try again',
      },
    });
  } else if (error.code === 'ENOENT') {
    callback({
      statusCode: 500,
      respObj: {
        success: false,
        message: 'A connection error occured. Please check and try again',
      },

    });
  } else if (error.code === 'ENOENT') {
    callback({
      statusCode: 500,
      message: 'A connection error occured. Please check and try again',
    });
  } else {
    console.log(error);
    callback({
      statusCode: 500,
      respObj: {
        success: false,
        message: 'Unknown error occured. Please check your parameters and try again',
      },

    });
  }
}


/**
 * The RequestService class acts as a layer between a RequestController and
 * RequestMapper classes. RequestService contains static methods for
 * performing the different actions that a RequestController may want to do.
 * RequestService has the responsibility of making calls to the RequestMapper and
 * converting the result of those calls to http responses
 */
class RequestService {
  static getByUsername(clientUsername, callback) {
    ReqeustMapper.getByUsername(clientUsername, (result) => {
      handleGetRequests(result.rows, callback);
    }, (error) => {
      console.log(error);
      errorHandler(error, callback);
    });
  }

  /**
   * This gets all the request in the database and creates a response object
   * which the request controller can inteprete easily
   * @param {function} callback called with a response object
   */
  static getAll(date, callback) {
    ReqeustMapper.getAll(date, (result) => {
      handleGetRequests(result.rows, callback);
    }, (error) => {
      errorHandler(error, callback);
    });
  }

  /**
   * Gets a specific request made by a client specified by the using the clientUsername
   * and requestId
   * @param {string} clientUsername the clientUsername in the reques
   * @param {string} requestId the id of the request
   */
  static getByUsernameAndId(clientUsername, requestId, callback) {
    ReqeustMapper.getByUsernameAndId(clientUsername, requestId, (result) => {
      handleGetRequests(result.rows, callback, true);
    }, (error) => {
      errorHandler(error, callback);
    });
  }


  static getById(requestId, callback) {
    ReqeustMapper.getById(requestId, (result) => {
      handleGetRequests(result.rows, callback, true);
    }, (error) => {
      errorHandler(error, callback);
    });
  }

  /**
   * Attempts to add a new request in the database and creates a response object
   * that contains the result of the operation.
   * @param {object} request  the new request to be added
   * @param {Function} callback called with the response object
   */
  static makeRequest(request, callback) {
    const mapperObj = new ReqeustMapper(request);
    mapperObj.create((result) => {
      if (result.rowCount === 1) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
            message: 'New request was successfully created',
          },

        });
      }
      mailManager.sendNewRequestNotification(result.rows[0]);
    }, (error) => {
      errorHandler(error);
    });
  }

  /**
   * Modifies a request using the username and id of the request
   * @param {string} username username of the reques
   * @param {object} request the new request
   * @param {number} id an integer containing the id
   * @param {function} callback called with the response object
   */
  static modify(username, request, id, callback) {
    const mapperObj = new ReqeustMapper(request, id);

    ReqeustMapper.getByUsernameAndId(username, id, (result) => {
      if (result.rowCount > 0) {
        const previousRequest = result.rows[0];

        if (previousRequest.status === 'pending') {
          mapperObj.update(username, (res) => {
            callback({
              statusCode: 201,
              respObj: {
                success: true,
                data: res.rows[0],
                message: 'Request was successfully modified',
              },

            });

            mailManager.sendUpdateRequestNotification(result.rows[0]);
          }, error => errorHandler(error, callback));
        } else {
          callback({
            statusCode: 409,
            respObj: {
              success: false,
              message: `The engineer has responded to this request. The current status of this request is ${previousRequest.status} `,
              data: result.rows[0],
            },
          });
        }
      } else {
        callback({
          statusCode: 404,
          respObj: {
            success: false,
            message: 'The id was not found',
          },
        });
      }
    }, error => errorHandler(error, callback));
  }

  /**
   * This updates the status of a request
   * @param {boolean} status the new status of the request
   * @param {number} requestId the id of the request to be updated
   * @param {function} callback a function called with the generated response object
   */
  static updateStatus(status, requestId, callback, message) {
    ReqeustMapper.updateStatus(requestId, status, message, (result) => {
      const { rows } = result;

      if (rows.length > 0) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: rows[0],
            message: 'Request updated successfully',
          },
        });
      } else {
        callback({
          statusCode: 404,
          respObj: {
            success: false,
            message: 'The request Id you specified does not exist',
          },
        });
      }
    }, (error) => {
      errorHandler(error, callback);
    });
  }

  /**
   * Gets the statistics of all the requests in the database and creates a
   * response object with the value
   * @param {function} callback called with the response of the operation
   */
  static getStatistics(callback) {
    ReqeustMapper.getStats((result) => {
      callback({
        statusCode: 200,
        respObj: {
          success: true,
          data: result.rows[0],
          message: 'Statistics of the requests was successfully retrieved',
        },
      });
    }, (error) => {
      errorHandler(error, callback);
    });
  }
}

export default RequestService;
