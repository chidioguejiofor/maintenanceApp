import UserMapper from './UserMapper';
/**
 * An EngineerMapper makes inserting and updating rows in the "Engineers" table
 * easier and more convenient
 */
export default class EngineerMapper extends UserMapper {
  /**
       * This creates a EngineerMapper that contains sql for inserting and updating
       * row(s) in the "Engineers" table using the arguments
       * @param {object} newEngineer the new Engineer
       * @param {object} [existingEngineer] optionally an engineer to be added to the db
       */
  constructor(newEngineer, existingEngineer) {
    super(newEngineer, existingEngineer, 'Engineers');
  }

  static loginQuery(username, password, callback, errorHandler) {
    super.loginQuery(username, password, 'Engineers', callback, errorHandler);
  }
}

