import userService from '../services/userService';
import SignUpValidator from '../validators/SignUpValidator';
import LoginValidator from '../validators/LoginValidator';
import authenticator from '../helpers/authenticator';
import Controller from './Controller';
import UserValidator from '../validators/UserValidator';

function getUser(body) {
  const {
    email, username, password,
  } = body;
  const user = {
    email, username, password, userType: 'client',
  };

  const validationResult = new SignUpValidator(user).validate();
  return { user, validationResult };
}


export default class UserController extends Controller {
  static signup(req, resp) {
    UserController.createUserHelper(req, resp);
  }


  static createToken(data, userType, callback, expires = '3days') {
    const payload = {
      [userType]: data,
    };
    authenticator.createToken(payload, expires, callback);
  }

  static login(req, resp) {
    const { username, password, userType } = req.body;

    const user = { username, password, userType };
    const validationResult = new LoginValidator(user).validate();
    if (validationResult.valid) {
      userService.getByCredentials(username, password, userType, (result) => {
        const { respObj } = result;
        if (respObj.data) {
          UserController.createToken(respObj.data, userType, (err, token) => {
            respObj.data.token = token;
            resp.status(result.statusCode).json(result.respObj);
          });
        } else {
          resp.status(result.statusCode).json(result.respObj);
        }
      });
    } else {
      resp.status(400).json(LoginValidator.handleBadData(validationResult));
    }
  }

  static createUserHelper(req, resp) {
    const { validationResult, user } = getUser(req.body);
    if (validationResult.valid) {
      userService.createUser(user, (result) => {
        if (result.respObj.data) {
          UserController.createToken(result.respObj.data, 'client', (err, token) => {
            result.respObj.data.token = token;// eslint-disable-line no-param-reassign
            resp.status(result.statusCode).json(result.respObj);
          });
        } else {
          resp.status(result.statusCode).json(result.respObj);
        }
      });
    } else {
      resp.status(400).json(SignUpValidator.handleBadData(validationResult));
    }
  }
  static reset(req, resp) {
    const { body: { email, userType } } = req;
    const validator = new UserValidator({ email, userType }, 'email', 'userType');
    const validationResult = validator.validate();

    if (validationResult.valid) {
      userService.emailExists(email, userType, (data) => {
        if (data) {
          UserController.createToken(data, userType, (err, token) => {
            if (err) {
              resp.status(500).json({
                success: false,
                message: 'An error occured while processing your request',
              });
            } else {
              resp.status(201).json({
                success: true,
                data: { token },
                message: 'Use this token to reset password of the specified email',
              });
            }
          }, '120s');
        } else {
          resp.status(404).json({
            success: false,
            message: 'The email you specified does not exists',
          });
        }
      });
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }

  static acceptReset(req, resp) {
    const { body: { password }, authData } = req;

    const userType = authData.client ? 'client' : 'engineer';
    const updateUser = {
      userType,
      password,
      email: authData[userType].email,
      username: authData[userType].username,
    };
    const validationResult = new UserValidator(updateUser, 'password', 'email').validate();
    if (validationResult.valid) {
      userService.updateUser(updateUser, (response) => {
        resp.status(response.statusCode)
          .json(response.respObj);
      });
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }
}

