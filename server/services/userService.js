import EngineerMapper from '../database/mappers/EngineerMapper';
import ClientMapper from '../database/mappers/ClientMapper';
import UserMapper from '../database/mappers/UserMapper';

import PasswordHasher from '../helpers/PasswordHasher';

function getTableName(userType) {
  return userType === 'engineer' ? 'Engineers' : 'Clients';
}
function getMapper(userType, userObj) {
  if (userType === 'engineer') {
    return new EngineerMapper(userObj);
  }
  return new ClientMapper(userObj);
}

function errorHandler(error, callback, properties = '') {
  if (+error.code === 23505) { // duplicate key
    console.log(error.number, 'gotHere, errnum');
    callback({
      statusCode: 404,
      respObj: {
        success: false,
        message: `The specified ${properties} already exists`,
      },

    });
  } else {
    callback({
      statusCode: 500,
      message: 'Unknown error occured. Please check your parameters and try again',
    });
  }
}
class UserService {
  static getByCredentials(username, password, userType, callback) {
    let response;
    let mapper = ClientMapper;
    if (userType === 'engineer') {
      mapper = EngineerMapper;
    }
    mapper.loginQuery(username, PasswordHasher.hash(password), (result) => {
      if (result.rows.length > 0) {
        response = {
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
          },
        };
      } else {
        response = {
          statusCode: 404,
          respObj: {
            success: false,
            message: 'The specified username and password does not exists',
          },
        };
      }

      callback(response);
    }, (err) => {
      response = {
        statusCode: 500,
        respObj: {
          success: false,
          message: 'The specified user was not found',
        },
      };
      callback(response, err);
    });
  }


  /**
   * Adds a new user into the database
   * @param {Client} user an instance of model User that contains a userType, username,
   * password and email properties
   */
  static createUser(user, callback) {
    const userObj = user;
    userObj.password = PasswordHasher.hash(userObj.password);
    const mapper = getMapper(user.userType, userObj);

    let response;
    mapper.create((result) => {
      if (result.rowCount > 0) {
        response = {
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
          },
        };
      } else {
        response = {
          statusCode: 500,
          respObj: {
            success: false,
            message: `The new ${user.userType} was not created for unknown reasons`,
          },
        };
      }

      callback(response);
    }, (err) => {
      if (+err.code === 23505) {
        response = {
          statusCode: 409,
          respObj: {
            success: false,
            message: 'The specified username or email already exists',
          },
        };
      } else {
        console.log(err);
        response = {
          statusCode: 400,
          respObj: {
            success: false,
            message: 'Unknown error occured',
          },
        };
      }

      callback(response);
    });
  }

  static emailExists(email, userType, callback) {
    const tableName = userType === 'engineer' ? 'Engineers' : 'Clients';
    UserMapper.findMail(email, tableName, (result) => {
      console.log(result);
      callback(result.rowCount > 0);
    }, (err) => {
      console.log(err);
      callback(false);
    });
  }

  static updateUser(user, userType, callback) {
    const hashedUser = user;
    hashedUser.password = PasswordHasher.hash(user.password);
    UserMapper.updateCredentials(hashedUser, getTableName(userType), (result) => {
      if (result.rowCount > 0) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
          },
        });
      } else {
        callback({
          statusCode: 400,
          respObj: {
            success: false,
            message: 'Failed to reset  password the token you provided is invalid',
          },
        });
      }
    }, (error) => {
      console.log(error, 'it is the same ', errorHandler);
      errorHandler(error, callback, 'username');
    });
  }
}


export default UserService;
