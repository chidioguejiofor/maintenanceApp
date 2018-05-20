import uuid from 'uuid';

class UserService {
  constructor() {
    this.users = {};
  }

  getByCredentials(username, password) {
    const foundObj = Object.values(this.users)
      .find(user =>
        user.username === username && user.password === password);

    if (foundObj) {
      return {
        respObj: {
          success: true,
          data: {
            id: foundObj.id,
            username: foundObj.username,
            userType: foundObj.userType,
            email: foundObj.email,
          },

        },
        statusCode: 200,
      };
    }
    return {
      respObj: {
        success: false,
        message: 'The inputed username and password combination was not found',
      },
      statusCode: 404,
    };
  }

  /**
   *
   * @param {*} id
   */
  getById(id) {
    return this.users[id];
  }

  /**
   * Adds a new user into the system
   * @param {*} user an instance of model User that contains a userType, username,
   * password and email properties
   */
  createUser(user) {
    const id = uuid.v4();
    const newUser = Object.assign({}, user, { id });
    this.users[id] = newUser;
    return {
      statusCode: 201,
      respObj: {
        success: true,
        data: newUser,
      },
    };
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
