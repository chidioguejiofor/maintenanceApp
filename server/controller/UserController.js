import userService from '../services/userService';
import User from '../models/User';
import UserValidator from '../validators/UserValidator';

export default class UserController {
  static signup(req, resp) {
    const {
      email, username, password, userType,
    } = req.body;
    const user = new User(username, password, email, userType);

    const validateObj = new UserValidator(user).validate();

    if (validateObj.valid) {
      const data = userService.createUser(user);
      resp.status(201).json({
        success: true,
        data,
      });
    } else if (validateObj.missingData) {
      resp.status(400).json({
        success: false,
        message: 'Some required fields are missing',
        missingData: validateObj.missingData,
      });
    } else {
      resp.status(400).json({
        success: false,
        message: 'Some data you passed is invalid',
        invalidData: validateObj.invalidData,
      });
    }
  }


  static login(req, resp) {
    const { username, password } = req.body;
    const user = userService.getByCredentials(username, password);
    if (user) {
      resp.status(200).json({
        success: true,
        data: user,
      });
    } else {
      resp.status(404).json({
        success: false,
      });
    }
  }
}
