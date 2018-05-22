/* esint-diasable no-console: off */

import { Pool } from 'pg';

const user = process.env.DATABASE_USER || 'maintenance_app_client';
const productionConfig = {
  user,
  database: process.env.DATABASE_URL || 'maintenance_app_db',
  password: process.env.DATABASE_PASSWORD || null,
  port: process.env.DATABASE_PORT || null,
  host: 'localhost',
};

const testConfig = {
  user,
  database: process.env.DATABASE_URL || 'maintenance_app_db',
  password: process.env.DATABASE_PASSWORD || null,
  port: process.env.DATABASE_PORT || null,
  host: 'localhost',
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
          if (err) {
            errorHandler(error);
          } else {
            callback(result);
          }
          done();
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

  static connect() {
    client.connect();
  }


  static initTestConfig() {
    pool = new Pool(testConfig);
  }

  static initProductionConfig() {
    pool = new Pool(productionConfig);
  }
}

export default DatabaseManager;


class ConnectionManager {
  static query(text, params, callback) {
    return pool.query(text, params, (err, res) => {
      callback(err, res);
    });
  }

  static getClient(callback) {
    pool.connect((err, client, done) => {
      callback(err, client, done);
    });
  }
}

