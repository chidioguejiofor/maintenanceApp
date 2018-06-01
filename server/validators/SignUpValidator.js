import UserValidator from './UserValidator';

/**
 * A SignUpValidator contains logic for validating a signup data
 * provided by a user
 */
class SignUpValidator extends UserValidator {
  constructor(model) {
    super(model, 'username', 'password', 'email');
  }
}

export default SignUpValidator;

