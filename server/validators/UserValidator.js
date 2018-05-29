import ModelValidator from './ModelValidator';


class UserValidator extends ModelValidator {
  constructor(model, ...requiredProperties) {
    const userProperties = {
      password: {
        message: 'must be at least 5 characters of any type',
        pattern: /.{5,}/g,
      },
      email: {
        message: 'must have the format<username>@<hostname>.com and <username>must begin with an alphabet',
        pattern: /[a-z][a-z0-9]{1,}@.{1,}\.com/i,
      },
      userType: {
        message: 'must be either "engineer" or "client"',
        pattern: /client|engineer/i,
      },
      username: {
        message: 'can contain letters or number but must begin with a letter',
        pattern: /[a-z][a-z0-9]{3,}/g,
      },
    };
    const requirements = {};
    requiredProperties
      .forEach((property) => {
        requirements[property] = userProperties[property];
      });
    super(model, requirements);
    this.requiredProperties = requiredProperties;
  }

  validate() {
    const testProps = {};
    this.requiredProperties
      .forEach((elem) => {
        testProps[elem] = this.model[elem];
      });

    return super.runValidation(testProps);
  }
}

export default UserValidator;

