import DatabaseManager from './DatabaseManager';

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
    this.update = sqlObj.update;
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
    DatabaseManager.executeQuery(this.createSql, (result) => {
      callback(result);
    }, errorHandler, this.createValues);
  }

  /**
   *This updates a specified row in the table. The row to update is determined
   by the values passed in the constructor when this object was being created
   * @param {string} key represents the attribute(s)/ column(s) to be updated
   * @param {Function} callback called with the result of the query when the operation
   * was successful
   * @param {Function} errorHandler called when an error occured
   */
  update(key, callback, errorHandler) {
    DatabaseManager.executeQuery(this.update[key].sql, () => {
      callback();
    }, errorHandler, this.updateValues);
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
              `INSERT INTO "Engineers"(username, password, email)
                  VALUES($1, $2, $3) `,
        values: [newClient.username, newClient.password, newClient.email],

      },
    };
    if (existingClient) {
      obj.update = {
        'username-password': {
          sql: `UPDATE "Engineers" 
              SET username = $1, password = $2
              WHERE password = $4 AND username = $5`,
          values: [
            newClient.username, newClient.password,
            existingClient.password, existingClient.username,
          ],
        },

        password: {
          sql: `UPDATE "Engineers" SET password = ($1)
                  WHERE password = ($4) AND username = ($5)`,
          values: [newClient.password, existingClient.password, existingClient.username],

        },
        email: {
          sql: `UPDATE "Engineers" SET email = ($1)
                    WHERE password = ($4) AND username = ($5)`,
          values: [newClient.email, existingClient.password, existingClient.username],

        },
      };
    }
    super(obj);
  }

  static loginQuery(username, password, callback, errorHandler) {
    const sql = `SELECT username, email FROM "Clients" WHERE 
              username = ($1) AND password = ($2)`;

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
                  VALUES($1, $2, $3) `,
        values: [newEngineer.username, newEngineer.password, newEngineer.email],

      },
    };
    if (existingEngineer) {
      obj.update = {
        'username-password': {
          sql: `UPDATE "Engineers" 
              SET username = $1, password = $2
              WHERE password = $4 AND username = $5`,
          values: [
            newEngineer.username, newEngineer.password,
            existingEngineer.password, existingEngineer.username,
          ],
        },

        password: {
          sql: `UPDATE "Engineers" SET password = ($1)
                  WHERE password = ($4) AND username = ($5)`,
          values: [newEngineer.password, existingEngineer.password, existingEngineer.username],

        },
        email: {
          sql: `UPDATE "Engineers" SET email = ($1)
                    WHERE password = ($4) AND username = ($5)`,
          values: [newEngineer.email, existingEngineer.password, existingEngineer.username],

        },
      };
    }
    super(obj);
  }
}

/**
 * An ReqeustMapper makes inserting and updating rows in the "Reqeuests" table
 * easier and more convenient
 */
export class ReqeustMapper extends TableMapper {
  constructor(newRequest, id) {
    super({
      create: {
        sql:
                `INSERT INTO "Requests"( title, description, location, image, clientUsername)
                    VALUES($1, $2, $3,$3, $4, $5, $6 ) `,
        values: [
          newRequest.title, newRequest.description,
          newRequest.location, newRequest.image,
          newRequest.clientUsername],

      },
      update: {
        request: {
          sql: `UPDATE "Requests"( title, description, location, image, clientUsername)
                    VALUES($1, $2, $3,$3, $4, $5, $6 )
                    WHERE id = ($7)`,
          values: [
            newRequest.title, newRequest.description,
            newRequest.location, newRequest.image,
            newRequest.clientUsername, id],
        },
      },
    });
  }
}

/**
 * An ReqeustStatusMapper makes inserting and updating rows in the "RequestStatus" table
 * easier and more convenient
 */
export class ReqeustStatusMapper extends TableMapper {
  constructor(newRequest, id) {
    super({
      create: {
        sql: `INSERT INTO "Requests"( title, description, location, image, clientUsername)
                        VALUES($1, $2, $3,$3, $4, $5, $6 ) `,
        values: [
          newRequest.title, newRequest.description,
          newRequest.location, newRequest.image,
          newRequest.clientUsername],

      },
      update: {
        request: {
          sql: `UPDATE "Requests"( title, description, location, image, clientUsername)
                        VALUES($1, $2, $3,$3, $4, $5, $6 )
                        WHERE id = ($7)`,
          values: [
            newRequest.title, newRequest.description,
            newRequest.location, newRequest.image,
            newRequest.clientUsername, id],
        },
      },
    });
  }
}
