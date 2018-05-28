
import ReqeustMapper from '../database/mappers/RequestMapper';

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
    callback({
      statusCode: 204,
    });
  }
}

function errorHandler(error, callback) {
  console.log(error);
  if (+error.number === 23503) {
    callback({
      statusCode: 404,
      respObj: {
        success: false,
        message: 'The clientUsername you specified does not exists',
      },

    });
  } else {
    callback({
      statusCode: 500,
      message: 'Unknown error occured. Please check your parameters and try again',
    });
  }
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
  static getById(clientUsername, requestId, callback) {
    ReqeustMapper.getById(clientUsername, requestId, (result) => {
      handleGetRequests(result.rows, callback, true);
    }, (error) => {
      errorHandler(error, callback);
    });
  }


  static makeRequest(request, callback) {
    const mapperObj = new ReqeustMapper(request);
    mapperObj.create((result) => {
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

  static modify(username, request, id, callback) {
    const mapperObj = new ReqeustMapper(request, id);

    ReqeustMapper.getById(username, id, (result) => {
      if (result.rowCount > 0) {
        const previousRequest = result.rows[0];

        if (previousRequest.status === 'created') {
          mapperObj.update(username, (res) => {
            callback({
              statusCode: 201,
              respObj: {
                success: true,
                data: res.rows[0],
              },
            });
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
  static updateStatus(status, requestId, callback) {
    ReqeustMapper.updateStatus(requestId, status, (result) => {
      const { rows } = result;

      if (rows.length > 0) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: rows[0],
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

  static getStatistics(callback) {
    ReqeustMapper.getStats((result) => {
      if (result.rowCount > 0) {
        callback({
          statusCode: 200,
          respObj: {
            success: true,
            data: result.rows[0],
          },
        });
      }
    });
  }
}

export default RequestService;
