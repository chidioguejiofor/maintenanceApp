import ModelValidator from './ModelValidator';


class LoginValidator extends ModelValidator {
  constructor(model) {
    super(model, {
      password: {
        message: 'must be at least 5 characters of any type',
        pattern: /.{5,}/g,
      },
      userType: {
        message: 'must be either "engineer" or "client"',
        pattern: /client|engineer/i,
      },
      username: {
        message: 'can contain letters or number but must begin with a letter',
        pattern: /[a-z][a-z0-9]{3,}/g,
      },
    });
  }

  validate() {
    const {
      model: {
        password, userType, username,
      },
    } = this;

    const testObj = {
      password, userType, username,
    };
    return super.runValidation(testObj);
  }
}

export default LoginValidator;

