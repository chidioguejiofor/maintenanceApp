import { EngineerMapper, ClientMapper } from '../database/TableMappers';

class UserService {
  constructor() {
    this.users = {};
  }

  static getByCredentials(username, password, callback) {
    let response;
    ClientMapper.loginQuery(username, password, (result) => {
      if (result.length > 0) {
        response = {
          statusCode: 201,
          respObj: {
            success: true,
            data: result,
          },
        };
      } else {
        response = {
          statusCode: 500,
          respObj: {
            success: false,
            message: 'The specified user was not found',
          },
        };
      }

      callback(response);
    }, (err) => {
      console.error(err);
      response = {
        statusCode: 400,
        respObj: {
          success: false,
          message: 'Unknown error occured',
        },
      };
      callback(response);
    });
  }

  /**
   *
   * @param {*} id
   */
  getById(id) {
    return this.users[id];
  }

  /**
   * Adds a new user into the database
   * @param {Client} user an instance of model User that contains a userType, username,
   * password and email properties
   */
  createUser(user, callback) {
    let mapper;
    if (user.userType === 'engineer') {
      mapper = new EngineerMapper(user);
    } else {
      mapper = new ClientMapper(user);
    }
    let response;
    this.name = '';
    mapper.create((result) => {
      console.log(result);
      if (result.rowCount > 0) {
        response = {
          statusCode: 201,
          respObj: {
            success: true,
            data: user,
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
      console.error(err);
      response = {
        statusCode: 400,
        respObj: {
          success: false,
          message: 'Unknown error occured',
        },
      };
      callback(response);
      DatabaseManager.closeConnection();
    });
  }


  /**
   * This method resets the password of a user.
   * It returns undefined if the specified email does not exist
   * @param {string} email
   * @param {string} newPassword
   */
  resetPassword(email, newPassword) {
    const findResult = this.users.find(user => user.email === email);
    let changedObj;
    if (findResult) {
      this.users[findResult.id].password = newPassword;
      changedObj = this.users[findResult.id];
    }

    return changedObj;
  }
}


export default new UserService();
