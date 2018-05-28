import TableMapper from './TableMapper';
/**
 * An EngineerMapper makes inserting and updating rows in the "Engineers" table
 * easier and more convenient
 */
export default class EngineerMapper extends TableMapper {
  /**
       * This creates a EngineerMapper that contains sql for inserting and updating
       * row(s) in the "@ngineers" table using the arguments
       * @param {object} newEngineer the new Engineer
       * @param {object} [existingEngineer] optionally an engineer to be added to the db
       */
  constructor(newEngineer, existingEngineer) {
    const obj = {
      create: {
        sql:
                `INSERT INTO "Engineers"(username, password, email)
                    VALUES($1, $2, $3) RETURNING username, email`,
        values: [newEngineer.username, newEngineer.password, newEngineer.email],

      },
    };
    super(obj);
    this.newEngineer = newEngineer;
    this.existingEngineer = existingEngineer;
  }

  /**
     *This method uses this ClientMapper's new client to run an sql statement that
     updates the existingClient's password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updatePassword(callback, errorHandler) {
    const { newEngineer, existingEngineer } = this;
    const sql =
      `UPDATE "Engineers" SET password = ($1)
        WHERE password = ($2) AND username = ($3)`;
    const values = [newEngineer.password, existingEngineer.password, existingEngineer.username];
    EngineerMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }
  /**
     *Uses this EngineerMapper's newClient object to run an sql statement that
     updates the existingClient's username and password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateUsernameAndPassword(callback, errorHandler) {
    const { newEngineer, existingEngineer } = this;
    const sql = `UPDATE "Engineers" 
      SET username = $1, password = $2
      WHERE password = $4 AND username = $5`;
    const values = [
      existingEngineer.username, existingEngineer.password,
      newEngineer.username, newEngineer.password];
    EngineerMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }

  /**
     *Uses this EngineerMapper's newClient object to run an sql statement that
     updates the existingClient's email address
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateEmail(callback, errorHandler) {
    const { newEngineer, existingEngineer } = this;
    const sql = `UPDATE "Engineers" SET email = ($1)
      WHERE password = ($4) AND username = ($5)`;
    const values = [newEngineer.email, existingEngineer.password, existingEngineer.username];
    EngineerMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }

  static loginQuery(username, password, callback, errorHandler) {
    const sql = `SELECT username, email FROM "Engineers" 
                    WHERE username = $1 AND password = $2`;

    EngineerMapper.executeUpdateHelper(sql, [username, password], callback, errorHandler);
  }
}

