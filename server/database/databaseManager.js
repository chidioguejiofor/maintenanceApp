/* esint-diasable no-console: off */

import { Pool } from 'pg';

const productionConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 1,
};

const testConfig = {
  user: 'maintenance_app_client',
  database: process.env.DATABASE_URL || 'maintenance_app_db',
  password: process.env.DATABASE_PASSWORD || null,
  port: process.env.DATABASE_PORT || null,
  host: 'localhost',
  max: 1,
};

let pool;

/**
 *A databaseManager contains logic for executing sql statements in the database
 * It contains code that connects the
 */
class DatabaseManager {
  /**
   * This is used to executes sql statements in the databresult @param {*} sql
   * @param {function callback(result - contains the result of the request) {
     this fubction is called if there was no error in the server.
   }}
   *  @param {function errorHandler(error) {
     This is called with the error object if an error occured while executing the
     sql statem
   }}
   *  @param {Array} [values]  this optional params should be used when executing
   *  prepared statemaned */


  static executeQuery(sql, callback, errorHandler, values) {
    pool.connect((err, client, done) => {
      if (err) errorHandler(err);
      else {
        client.query(sql, values, (error, result) => {
          if (error) {
            errorHandler(error);
          } else {
            callback(result);
            done();
          }
        });
      }
    });
  }


  /**
   * Executes sql statement with any available client. This should be used when
   * only one call needs to be made
   * @param {string} sql syntatically correct SQL statement to be executed
   * @param {function callback(result) {
     called with the result of the call when the query executes successfully
   }}
   * @param {function errorHandler(params) {
   * called with an error object if an error occurs

   }}
   * @param {Array} [values]  this optional params should be used when executing
   *  prepared statemaned
   */
  static executeStream(sql, callback, errorHandler, values) {
    pool.query(sql, values, (err, res) => {
      if (err) {
        console.log(`Error while executing ${sql}`);
        errorHandler(err);
      } else {
        callback(res);
      }
    });
  }
  static initTestConfig() {
    pool = new Pool(testConfig);
  }

  static initProductionConfig() {
    pool = new Pool(productionConfig);
  }

  /**
   * This sets the maximum number of clients allowed in the pool using the method
   * argument.
   * @param {number} maxClient a number representing the maximum number of clients
   */
  static setPoolMaxSize(maxClient) {
    pool.max = maxClient;
  }
}

export default DatabaseManager;

