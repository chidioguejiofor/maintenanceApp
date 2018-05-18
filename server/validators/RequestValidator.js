import ModelValidator from './ModelValidator';


const requirements = {
  description: 'must be at least 5 alphanumeric letters or puncuations (dot and comma) and must start with a letter',
  title: 'must be between 5 to 20 alphanumberic letters or puncuations and must start with a letter',
  image: 'must be at least 3 character',
  location: 'must be between 5 to 100 alphanumeric characters',
  cilentId: 'any set of characters of at least one length',
};
export default class RequestValidator extends ModelValidator {
  static titlePattern() {
    return /[A-Z][a-z0-9\s]{5,20}/i;
  }

  static descriptionPattern() {
    return /[a-z]{1,}[a-z0-9,.]{5,}/i;
  }

  static locationPattern() {
    return /[a-z0-9]{5,200}/i;
  }

  static imagePattern() {
    return /.{3,}/;
  }

  static clientIdPattern() {
    return /.{1,}/;
  }
  static getPattern(attribute) {
    if (attribute === 'image') return RequestValidator.imagePattern();
    if (attribute === 'location') return RequestValidator.locationPattern();
    if (attribute === 'title') return RequestValidator.titlePattern();
    if (attribute === 'description') return RequestValidator.descriptionPattern();
    if (attribute === 'clientId') return RequestValidator.clientIdPattern();
    return undefined;
  }
  validate() {
    const {
      model: {
        title, description, location, image, clientId,
      },
    } = this;

    const testObj = {
      title, description, location, image, clientId,
    };

    const invalidData = [];
    const missingData = [];

    Object.keys(testObj)
      .forEach((property) => {
        if (!testObj[property]) missingData.push(property);
        else if (!RequestValidator.getPattern(property).test(testObj[property])) {
          invalidData.push({ [property]: requirements[property] });
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
}

