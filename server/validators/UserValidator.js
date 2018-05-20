import ModelValidator from './ModelValidator';

class UserValidator extends ModelValidator {
  constructor(user) {
    super();
    this.user = user;
  }

  static passwordPattern() {
    return /.{5,}/g;
  }

  static emailPattern() {
    return /.{1,}@.{1,}\.com/;
  }

  static userTypePattern() {
    return /client|engineer/i;
  }
  static usernamePattern() {
    return /[a-z][a-z0-9]{0,}/g;
  }

  validate() {
    const { user } = this;

    const invalidData = [];
    if (!UserValidator.passwordPattern().test(user.password)) {
      invalidData.push({ password: 'The password property must be at least 5 characters ' });
    }
    if (!UserValidator.usernamePattern().test(user.username)) {
      invalidData.push({ username: 'username can contain only letters or must be alphanumeric' });
    }

    if (!UserValidator.emailPattern().test(user.email)) {
      invalidData.push({ email: 'email must contain an @ and must be at least 4 characters' });
    }
    if (!UserValidator.userTypePattern().test(user.userType)) {
      invalidData.push({ userType: 'userType must be either client or engineer' });
    }
    if (invalidData.length > 0) {
      return {
        valid: false,
        invalidData,
      };
    }
    return { valid: true };
  }
}

export default UserValidator;

