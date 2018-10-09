import UserValidator from './UserValidator';

/**
 * A LoginValidator used to validate user login credentials
 */
class LoginValidator extends UserValidator {
  constructor(model) {
    super(model, 'password', 'userType', 'username');
  }
}

export default LoginValidator;

