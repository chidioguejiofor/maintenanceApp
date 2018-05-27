import { EngineerMapper, ClientMapper } from '../database/TableMappers';

import PasswordHasher from '../helpers/PasswordHasher';

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
    let mapper;
    if (user.userType === 'engineer') {
      mapper = new EngineerMapper(userObj);
    } else {
      mapper = new ClientMapper(userObj);
    }

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
            message: 'The specified username already exists',
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
}


export default UserService;
