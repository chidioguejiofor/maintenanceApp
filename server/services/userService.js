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
    callback({
      statusCode: 409,
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

/**
 * The UserService class acts as a layer between a UserController and
 * UserMapper classes. UserService contains static methods for
 * performing the different actions that a UserController may want to do.
 * UserService has the responsibility of making calls to the UserMapper and
 * converting the result of those calls to http responses
 */
class UserService {
  /**
   * Gets a user using the credentials provided
   * @param {string} username the user's usernam
   * @param {string} password the user's password
   * @param {string} userType equal to engineer or client
    * @param {string} callback called with the response object created
   */
  static getByCredentials(username, password, userType, callback) {
    let response;
    let mapper = ClientMapper;
    if (userType === 'engineer') {
      mapper = EngineerMapper;
    }
    mapper.loginQuery(username, PasswordHasher.hash(password), (result) => {
      if (result.rows.length > 0) {
        response = {
          statusCode: 200,
          respObj: {
            success: true,
            data: result.rows[0],
            message: 'Login successful',
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
      errorHandler(err, callback);
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
            message: 'Sign up successful',
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
      errorHandler(err, callback, 'username or email');
    });
  }

  /**
   * Checks if a specified email exists and calls the callback with the result
   * @param {string} email the email address of the user
   * @param {string} userType the userType of the user
   * @param {function} callback called with the response object
   */
  static emailExists(email, userType, callback) {
    const tableName = userType === 'engineer' ? 'Engineers' : 'Clients';
    UserMapper.findByMail(email, tableName, (result) => {
      callback(result.rows[0]);
    }, (error) => {
      console.log(error);
      callback(false);
    });
  }

  /**
   * Updates a user password using the username and email specified in the updateObject
   * and creates a response object with the result
   * @param {object} updateObj a new user object containing user credentials
   * @param {function} callback called with the result response object created
   */
  static updateUser(updateObj, callback) {
    const hashedUser = updateObj;
    hashedUser.password = PasswordHasher.hash(updateObj.password);
    UserMapper.updatePassword(hashedUser, getTableName(updateObj.userType), (result) => {
      if (result.rowCount > 0) {
        callback({
          statusCode: 201,
          respObj: {
            success: true,
            data: result.rows[0],
            message: 'User password has been successfully updated',
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
      errorHandler(error, callback, 'username');
    });
  }
}


export default UserService;
