import userService from '../services/userService';
import SignUpValidator from '../validators/SignUpValidator';
import LoginValidator from '../validators/LoginValidator';
import authenticator from '../helpers/authenticator';
import Controller from './Controller';
import UserValidator from '../validators/UserValidator';
import MailManager from '../helpers/mailManager';

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
    const { token } = req.params;
    authenticator.verifyToken(token, (user) => {
      if (user) {
        userService.createUser(user.client, (result) => {
          if (result.respObj.data) {
            UserController.createToken(result.respObj.data, 'client', (err, userToken) => {
              const { respObj } = result;
              respObj.data.token = userToken;
              resp.redirect('https://chidiebere-maintenance-react.herokuapp.com/login');
            });
          } else {
            resp.status(result.statusCode).json(result.respObj);
          }
        });
      } else {
        resp.status(404).json({
          success: false,
          message: 'The signup confirmation link is invalid',
        });
      }
    });
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


  static makeSignupRequest(req, resp) {
    const { validationResult, user } = getUser(req.body);
    if (validationResult.valid) {
      userService.emailExists(user.email, 'client', (response) => {
        if (response) {
          resp.status(409).json({
            success: false,
            message: 'The email you specified already exists. Please reset your password to recover it',
          });
        } else {
          UserController.createToken(user, 'client', (err, token) => {
            MailManager.confirmSignup(user.email, token, (success, error) => {
              if (success) {
                resp.status(200).json({
                  success: true,
                  message: `A confirmation mail was sent to ${user.email}. Please check your mail`,
                });
              } else if (error.code === 'ECONNECTION') {
                resp.status(200).json({
                  success: false,
                  message: 'Connection error please check  your connection',
                });
              } else {
                console.log(error, 'the error ');
                resp.status(450).json({
                  success: false,
                  message: 'Problems occured while sending mail please check the email address you sent',
                });
              }
            });
          });
        }
      }, '5min');
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }
  static reset(req, resp) {
    const { body: { password, email, userType } } = req;
    const validator = new UserValidator({ password, email, userType }, 'password', 'email', 'userType');
    const validationResult = validator.validate();

    if (validationResult.valid) {
      userService.emailExists(email, userType, (data) => {
        if (data) {
          const newUser = data;
          newUser.password = password;
          UserController.createToken(data, userType, (err, token) => {
            if (err) {
              resp.status(500).json({
                success: false,
                message: 'An error occured while processing your request',
              });
            } else {
              MailManager.sendConfirmResetMail(email, token, (success) => {
                if (success) {
                  resp.status(200).json({
                    success: true,
                    message: `Reset instructions was sent to ${email}. Please check your mail`,
                  });
                } else {
                  resp.status(400).json({
                    success: false,
                    message: 'A connection error occured. Please check your connection',
                  });
                }
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
    const { params: { token } } = req;

    authenticator.verifyToken(token, (authData) => {
      const userType = authData.client ? 'client' : 'engineer';
      const updateUser = {
        userType,
        password: authData[userType].password,
        email: authData[userType].email,
        username: authData[userType].username,
      };
      const validationResult = new UserValidator(updateUser, 'password', 'email').validate();
      if (validationResult.valid) {
        userService.updateUser(updateUser, () => {
          resp.status(200).redirect('https://chidiebere-maintenance-react.herokuapp.com/login');
        });
      } else {
        resp.status(400).json(UserValidator.handleBadData(validationResult));
      }
    });
  }
}

