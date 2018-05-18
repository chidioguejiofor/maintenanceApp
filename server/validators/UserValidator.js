import ModelValidator from './ModelValidator';


class UserValidator extends ModelValidator {
  constructor(model) {
    super(model);
    this.requirements = {
      password: {
        message: 'must be at least 5 characters of any type',
        pattern: /.{5,}/g,
      },
      email: {
        message: 'must have the format<username>@<hostname>.com',
        pattern: /.{1,}@.{1,}\.com/,
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
  }
  getPattern(attribute) {
    return this.requirements[attribute].pattern;
  }
  validate() {
    const {
      model: {
        email, password, userType, username,
      },
    } = this;

    const testObj = {
      email, password, userType, username,
    };

    const invalidData = [];
    const missingData = [];

    Object.keys(testObj)
      .forEach((property) => {
        if (!testObj[property]) missingData.push(property);
        else if (!this.getPattern(property).test(testObj[property])) {
          invalidData.push({ [property]: this.requirements[property] });
        }
      });


    if (missingData.length > 0) {
      return {
        valid: false,
        missingData,
      };
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

