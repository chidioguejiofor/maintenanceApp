import DatabaseManager from './databaseManager';


/**
 * This helper functions is used to execute updates on the different TableMappers
 * @param {string} sql
 * @param {string} values
 * @param {function} callback
 * @param {function} errorHandler
 */
function executeUpdateHelper(sql, values, callback, errorHandler) {
  DatabaseManager.executeStream(sql, callback, errorHandler, values);
}
/**
 * A {@code TableMapper } is used to link an sql table to a javascript object
 * This is supposed to make it easier to insert new table rows in the database.
 *This is an abstract class and should not be instantiated
 */
class TableMapper {
  /**
     * This constructor takes an object that is created by a subclass object
        * and extracts sql for creating and updating the specified table
     * @param {object} sqlObj that is created by the subclass containing attributes
     * create and update. The create attribute stores an object in the form
     * {sql, values}, while the update contains diifferent attributes which represents
     * the different possible update combination in the table. Each of these contain
     * an object in the form {sql, values}
     */
  constructor(sqlObj) {
    this.createSql = sqlObj.create.sql;
    this.createValues = sqlObj.create.values;
  }

  /**
   * This executes the sql statement to insert a row in the specified table
   * and runs the callback if the operation was successful
   * @param {function callback(result) {
    This function takes is passed the result of the query
    once execution is complete
   }} callback the function to call when the operation was successful
   * @param {function errorHandler(error)  {
    This is called when an error occured while the query was being executed

   }}
   */
  create(callback, errorHandler) {
    DatabaseManager.executeStream(this.createSql, (result) => {
      callback(result);
    }, errorHandler, this.createValues);
  }
}
/**
 * This represents a single row in the "Clients" table in the database
 * A Client stores declares sql to be used for creating and updating to its
 * superclass
 */
export class ClientMapper extends TableMapper {
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
    executeUpdateHelper(sql, values, callback, errorHandler);
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
    executeUpdateHelper(sql, values, callback, errorHandler);
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
    executeUpdateHelper(sql, values, callback, errorHandler);
  }
  static loginQuery(username, password, callback, errorHandler) {
    const sql = `SELECT username, email FROM "Clients" 
                  WHERE username = $1 AND password = $2`;

    DatabaseManager.executeStream(sql, callback, errorHandler, [username, password]);
  }
}


/**
 * An EngineerMapper makes inserting and updating rows in the "Engineers" table
 * easier and more convenient
 */
export class EngineerMapper extends TableMapper {
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
    executeUpdateHelper(sql, values, callback, errorHandler);
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
    executeUpdateHelper(sql, values, callback, errorHandler);
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
    executeUpdateHelper(sql, values, callback, errorHandler);
  }

  static loginQuery(username, password, callback, errorHandler) {
    const sql = `SELECT username, email FROM "Engineers" 
                  WHERE username = $1 AND password = $2`;

    DatabaseManager.executeStream(sql, callback, errorHandler, [username, password]);
  }
}


const requestColumns = 'date , id, title, description, location, image, status, message';
/**
 * An ReqeustMapper makes inserting and updating rows in the "Reqeuests" table
 * easier and more convenient
 */
export class ReqeustMapper extends TableMapper {
  constructor(newRequest, id) {
    const requestOptions = {
      create: {
        sql:
                `INSERT INTO "Requests"( title, description, location, image, clientusername)
                    VALUES($1, $2, $3, $4, $5 ) RETURNING id, title, description, location, image, status, message;`,
        values: [
          newRequest.title, newRequest.description,
          newRequest.location, newRequest.image,
          newRequest.clientUsername],

      },
    };
    super(requestOptions);
    this.newRequest = newRequest;
    this.id = id;
  }

  /**
   * Uses the id and newRequest stored in this ReqeustMapper to create and execute
   * an sql statement that  update a request with the specified id
    @param {function callback(result) {
      called with the result of the query. Note that this result is an object that contains
      rows, rowcount etc
   }} callback
   * @param {function errorHandler(sqlError) {
      called when an error occurs. It takes the error object as its argument
   }} errorHandler
   */
  update(callback, errorHandler) {
    const { newRequest, id } = this;
    const sql = `
    UPDATE "Requests"( title, description, location, image, clientUsername)
    VALUES($1, $2, $3,$3, $4, $5, $6 )
    WHERE id = ($7) RETURNING ${requestColumns};`;
    const values = [
      newRequest.title, newRequest.description,
      newRequest.location, newRequest.image,
      newRequest.clientUsername, id,
    ];
    executeUpdateHelper(sql, values, callback, errorHandler);
  }
  /**
   * Gets the request of a specified client using the client username
   * @param {string} username
   * @param {function callback(result) {
      called with the result of the query. Note that this result is an object that contains
      rows, rowcount etc
   }} callback
   * @param {function errorHandler(sqlError) {
      called when an error occurs. It takes the error object as its argument
   }} errorHandler
   */
  static getByUsername(username, callback, errorHandler) {
    const sql =
    `SELECT ${requestColumns}  FROM "Requests"
        WHERE clientUsername = $1`;
    DatabaseManager.executeStream(sql, callback, errorHandler, [username]);
  }

  /**
   * Gets a request that has a specified id and username
   * @param {*} username the username of the client
   * @param {*} id the id of the request
     @param {function callback(result) {
      called with the result of the query. Note that this result is an object that contains
      rows, rowcount etc
   }} callback
   * @param {function errorHandler(sqlError) {
      called when an error occurs. It takes the error object as its argument
   }} errorHandler
   */
  static getById(username, id, callback, errorHandler) {
    const sql =
    `SELECT ${requestColumns}  FROM "Requests"
        WHERE clientusername = $1 AND id = $2 `;
    DatabaseManager.executeStream(sql, callback, errorHandler, [username, id]);
  }

  /**
   *Gets all the request in the database
  @param {function callback(result) {
      called with the result of the query. Note that this result is an object that contains
      rows, rowcount etc
   }} callback
   * @param {function errorHandler(sqlError) {
      called when an error occurs. It takes the error object as its argument
   }} errorHandler
   */
  static getAll(callback, errorHandler) {
    const sql =
    `SELECT ${requestColumns}  FROM "Requests"`;
    DatabaseManager.executeStream(sql, callback, errorHandler);
  }

  /**
   * Updates the status of a request with the specified requestId
   * @param {*} requestId   the id of the request
   * @param {*} newStatus the new status of the request
      @param {function callback(result) {
      called with the result of the query. Note that this result is an object that contains
      rows, rowcount etc
   }} callback
   * @param {function errorHandler(sqlError) {
      called when an error occurs. It takes the error object as its argument
   }} errorHandler
   */
  static updateStatus(requestId, newStatus, callback, errorHandler) {
    const sql =
    `UPDATE  "Requests" SET status = $1
      WHERE id = $2  
      RETURNING  ${requestColumns}`;

    DatabaseManager.executeStream(sql, callback, errorHandler, [newStatus, requestId]);
  }
}

