/* esint-diasable no-console: off */

import { Pool } from 'pg';

const dbURL = process.env.DATABASE_URL;
let user = 'maintenance_app_client';

const productionConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 1,
};

console.log('Erntered');
const testConfig = {
  user,
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
   * @param {*} callback
   * @param {*} errorHandler
   * @param {*} [values]  */


  static executeQuery(sql, callback, errorHandler, values) {
    pool.connect((err, client, done) => {
      if (err) errorHandler(err);
      else {
        client.query(sql, values, (error, result) => {
          done();
          if (error) {
            errorHandler(error);
          } else {
            callback(result);
          }
        });
      }
    });
  }


  static executeStream(sql, callback, errorHandler, values) {
    pool.query(sql, values, (err, res) => {
      if (err) errorHandler(err);
      else {
        callback(res);
      }
    });
  }

  static user() {
    return user;
  }


  static initTestConfig() {
    pool = new Pool(testConfig);
    user = 'maintenance_app_client';
  }

  static initProductionConfig() {
    user = dbURL.split('//')[1].split(':')[0];/* esint-disable line prefer-destructuring: off */
    console.log(user, 'The user got here');
    pool = new Pool(productionConfig);
    console.log(pool, 'pool contents');
  }
}

export default DatabaseManager;

