import TableMapper from './TableMapper';
/**
 * This represents a single row in the "Clients" table in the database
 * A Client stores declares sql to be used for creating and updating to its
 * superclass
 */
export default class ClientMapper extends TableMapper {
  /**
       *This consstructor intialises this Client by creating an sqlObject and
       sending it to the super class. The sqlObject attributes for creating
       and updating the "Clients" table in the database.
       Client attributes include username, password and email with username being the
       primary key
       * @param {objet} newClient this is an object that represents data to be added in the
       * "Clients" table. Note that tnis object may contain only the specific columns that is
       * to be added in the system.
       * @param  {object} [existingClient] this optional parameter is would be used when updating
       * this Client. The
       */
  constructor(newClient, existingClient) {
    const obj = {
      create: {
        sql:
                `INSERT INTO "Clients"(username, password, email)
                    VALUES($1, $2, $3) RETURNING username, email`,
        values: [newClient.username, newClient.password, newClient.email],

      },
    };
    super(obj);
    this.existingClient = existingClient;
    this.newClient = newClient;
  }


  /**
     *This method uses this ClientMapper's new client to run an sql statement that
     updates the existingClient's password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updatePassword(callback, errorHandler) {
    const { newClient, existingClient } = this;
    const sql = `UPDATE "Clients" SET password = ($1)
        WHERE password = ($2) AND username = ($3)`;
    const values = [newClient.password, existingClient.password, existingClient.username];
    ClientMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }
  /**
     *Uses this ClientMapper's newClient object to run an sql statement that
     updates the existingClient's username and password
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateUsernameAndPassword(callback, errorHandler) {
    const { newClient, existingClient } = this;
    const sql = `UPDATE "Clients" 
      SET username = $1, password = $2
      WHERE password = $4 AND username = $5`;
    const values = [
      existingClient.username, existingClient.password,
      newClient.username, newClient.password];
    ClientMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }

  /**
     *Uses this ClientMapper's newClient object to run an sql statement that
     updates the existingClient's email address
     * @param {function} callback
     * @param {function} errorHandler
     */
  updateEmail(callback, errorHandler) {
    const { newClient, existingClient } = this;
    const sql = `UPDATE "Engineers" SET email = ($1)
      WHERE password = ($4) AND username = ($5)`;
    const values = [newClient.email, existingClient.password, existingClient.username];
    ClientMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }
  static loginQuery(username, password, callback, errorHandler) {
    const sql = `SELECT username, email FROM "Clients" 
                    WHERE username = $1 AND password = $2`;

    ClientMapper.executeUpdateHelper(sql, [username, password], callback, errorHandler);
  }
}

