

export default class ModelValidator {
  constructor(model, requirements) {
    this.model = model;
    this.requirements = requirements;
  }


  getPattern(key) {
    return this.requirements[key].pattern;
  }

  runValidation(testObj) {
    const invalidData = [];
    const missingData = [];

    Object.keys(testObj)
      .forEach((property) => {
        if (!testObj[property]) missingData.push(property);
        else if (!this.getPattern(property).test(testObj[property])) {
          invalidData.push({ [property]: this.requirements[property].message });
        }
      });

    if (missingData.length > 0) {
      return {
        valid: false,
        missingData,
      };
    } else if (invalidData.length > 0) {
      return {
        valid: false,
        invalidData,
      };
    }


    return { valid: true };
  }


  static handleBadData(validationResult) {
    if (validationResult.missingData) {
      return {
        success: false,
        message: 'Some required fields are missing',
        missingData: validationResult.missingData,
      };
    }
    return {
      success: false,
      message: 'Some data you passed is invalid',
      invalidData: validationResult.invalidData,
    };
  }
}
