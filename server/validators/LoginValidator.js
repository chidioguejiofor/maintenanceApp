import UserValidator from './UserValidator';


class LoginValidator extends UserValidator {
  constructor(model) {
    super(model, 'password', 'userType', 'username');
  }

  // validate() {
  //   const {
  //     model: {
  //       password, userType, username,
  //     },
  //   } = this;

  //   const testObj = {
  //     password, userType, username,
  //   };
  //   return super.runValidation(testObj);
  // }
}

export default LoginValidator;

