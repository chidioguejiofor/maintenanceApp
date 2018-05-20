import userService from '../services/userService';
import User from '../models/User';
import UserValidator from '../validators/UserValidator';
import LoginValidator from '../validators/LoginValidator';

function getUser(body) {
  const {
    email, username, password, userType,
  } = body;
  const user = new User(username, password, email, userType);

  const validationResult = new UserValidator(user).validate();
  return { user, validationResult };
}

export default class UserController {
  static signup(req, resp) {
    const { validationResult, user } = getUser(req.body);
    if (validationResult.valid) {
      const result = userService.createUser(user);
      resp.status(result.statusCode).json(result.respObj);
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }


  static login(req, resp) {
    const { username, password, userType } = req.body;
    const validationResult = new LoginValidator({ username, password, userType }).validate();

    if (validationResult.valid) {
      const result = userService.getByCredentials(username, password, userType);
      resp.status(result.statusCode).json(result.respObj);
    } else {
      resp.status(400).json(UserValidator.handleBadData(validationResult));
    }
  }
}
