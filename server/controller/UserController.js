import userService from '../services/userService';
import UserValidator from '../validators/UserValidator';
import LoginValidator from '../validators/LoginValidator';
import authenticator from '../helpers/authenticator';

function getUser(body) {
  const {
    email, username, password, userType,
  } = body;
  const user = {
    email, username, password, userType,
  };

  const validationResult = new UserValidator(user).validate();
  return { user, validationResult };
}

export default class UserController {
  static signup(req, resp) {
    const { validationResult, user } = getUser(req.body);
    if (validationResult.valid) {
      userService.createUser(user, (result) => {
        if (result.respObj.data) {
          const payload = {
            client: result.respObj.data,
          };
          authenticator.createToken(payload, '3days', (err, token) => {
            result.respObj.data.token = token;// eslint-disable-line no-param-reassign
            resp.status(result.statusCode).json(result.respObj);
          });
        } else {
          resp.status(result.statusCode).json(result.respObj);
        }
      });
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }


  static login(req, resp) {
    const { username, password, userType } = req.body;
    const user = { username, password, userType };
    const validationResult = new LoginValidator(user).validate();


    if (validationResult.valid) {
      userService.getByCredentials(username, password, userType, (result) => {
        if (result.respObj.data) {
          const payload = {
            [userType]: result.respObj.data,
          };
          authenticator.createToken(payload, '3days', (err, token) => {
            result.respObj.data.token = token;// eslint-disable-line no-param-reassign
            resp.status(result.statusCode).json(result.respObj);
          });
        } else {
          resp.status(result.statusCode).json(result.respObj);
        }
      });
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }
}
