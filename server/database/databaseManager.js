/* esint-diasable no-console: off */

import { Pool } from 'pg';

const user = process.env.DATABASE_USER || 'maintenance_app_client';
const productionConfig = {
  user,
  database: process.env.DATABASE_URL || 'maintenance_app_db',
  password: process.env.DATABASE_PASSWORD || null,
  port: process.env.DATABASE_PORT || null,
  host: 'localhost',
  max: 1,
};

const testConfig = {
  user,
  database: process.env.DATABASE_URL || 'maintenance_app_db',
  password: process.env.DATABASE_PASSWORD || null,
  port: process.env.DATABASE_PORT || null,
  host: 'localhost',
  max: 1,
};

let pool = new Pool(productionConfig);

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
          if (err) {
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
  }

  static initProductionConfig() {
    pool = new Pool(productionConfig);
  }
}

export default DatabaseManager;

