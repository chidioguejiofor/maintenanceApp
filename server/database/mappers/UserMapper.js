import TableMapper from './TableMapper';
/**
 * This represents a single row in the "Clients" table in the database
 * A Client stores declares sql to be used for creating and updating to its
 * superclass
 */
export default class UserMapper extends TableMapper {
  /**
       *This consstructor intialises this Client by creating an sqlObject and
       sending it to the super class. The sqlObject attributes for creating
       and updating the "Clients" table in the database.
       Client attributes include username, password and email with username being the
       primary key
       * @param {objet} newUser this is an object that represents data to be added in the
       * "Clients" table. Note that tnis object may contain only the specific columns that is
       * to be added in the system.
       * @param  {object} [existingUser] this optional parameter is would be used when updating
       * this User
       */
  constructor(newUser, existingUser, tableName) {
    const obj = {
      create: {
        sql:
                `INSERT INTO "${tableName}"(username, password, email)
                    VALUES($1, $2, $3) RETURNING username, email`,
        values: [newUser.username, newUser.password, newUser.email],

      },
    };
    super(obj);
    this.newUser = newUser;
    this.existingUser = existingUser;
    this.tableName = tableName;
  }


  /**
     *This method uses this UserMapper's new user to run an sql statement that
     updates the existingUser's password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updatePassword(callback, errorHandler) {
    const { newUser, existingUser } = this;
    const sql = `UPDATE "${this.tableName}" SET password = ($1)
        WHERE password = ($2) AND username = ($3)`;
    const values = [newUser.password, existingUser.password, existingUser.username];
    UserMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }
  /**
     *Uses this UserMapper's newUser object to run an sql statement that
     updates the existingUser's username and password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateUsernameAndPassword(callback, errorHandler) {
    const { newUser, existingUser } = this;
    const sql = `UPDATE "${this.tableName}" 
      SET username = $1, password = $2
      WHERE password = $4 AND username = $5`;
    const values = [
      existingUser.username, existingUser.password,
      newUser.username, newUser.password];
    UserMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }

  /**
     *Uses this UserMapper's newUser object to run an sql statement that
     updates the existingUser's email address
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateEmail(callback, errorHandler) {
    const { newUser, existingUser } = this;
    const sql = `UPDATE "${this.tableName}" SET email = ($1)
      WHERE password = ($4) AND username = ($5)`;
    const values = [newUser.email, existingUser.password, existingUser.username];
    UserMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }

  static loginQuery(username, password, tableName, callback, errorHandler) {
    const sql = `SELECT username, email FROM "${tableName}" 
                    WHERE username = $1 AND password = $2`;

    UserMapper.executeUpdateHelper(sql, [username, password], callback, errorHandler);
  }
}

