import UserValidator from './UserValidator';


class SignUpValidator extends UserValidator {
  constructor(model) {
    super(model, 'username', 'password', 'email', 'userType');
  }
}

export default SignUpValidator;

