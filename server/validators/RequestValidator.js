import ModelValidator from './ModelValidator';


export default class RequestValidator extends ModelValidator {
  constructor(model) {
    super(model, {
      description: {
        message: 'must be at least 5 alphanumeric letters or puncuations (dot and comma) and must start with a letter',
        pattern: /[a-z]{1,}[a-z0-9,.]{5,}/i,
      },
      title: {
        message: 'must be between 5 to 20 alphanumberic letters or puncuations and must start with a letter',
        pattern: /[A-Z][a-z0-9\s]{5,20}/i,
      },
      image: {
        message: 'must be at least 3 character',
        pattern: /.{3,}/,
      },
      location: {
        message: 'must be between 5 to 100 alphanumeric characters',
        pattern: /[a-z0-9]{5,200}/i,
      },
    });
  }


  validate() {
    const {
      model: {
        title, description, location, image,
      },
    } = this;
    const testObj = {
      title, description, location, image,
    };

    return super.runValidation(testObj);
  }
}

