import ModelValidator from './ModelValidator';

export default class RequestValidator extends ModelValidator {
  static titlePattern() {
    return /[A-Z][a-z0-9]{5,20}/i;
  }

  static descriptionPattern() {
    return /.{5,}/i;
  }

  static locationPattern() {
    return /.{5,200}/i;
  }

  static imagePattern() {
    return /.{1,}/;
  }

  validate() {
    const { model } = this;

    const invalidData = [];
    if (!RequestValidator.titlePattern().test(model.title)) {
      invalidData.push({ title: 'The title must start with an uppercase letter and must be at least 5 characters' });
    }
    if (!RequestValidator.locationPattern().test(model.location)) {
      invalidData.push({ location: 'The location must be at least 5 characters' });
    }

    if (!RequestValidator.imagePattern().test(model.image)) {
      invalidData.push({ image: 'The image must be at least 5 characters' });
    }

    if (!RequestValidator.descriptionPattern().test(model.description)) {
      invalidData.push({ description: 'The description must be at least 5 characters' });
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

