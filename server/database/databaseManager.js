/* esint-diasable no-console: off */

import { Client } from 'pg';

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

let client;
const query = (sql, callback, errorHandler, values) => {
  client.query(sql, values)
    .then(callback)
    .catch(errorHandler);
};


/**
 *A databaseManager contains logic for executing sql statements in the database
 * It contains code that connects the
 */
class DatabaseManager {
  static executeQuery(sql, callback, errorHandler, values) {
    query(sql, callback, errorHandler, values);
  }
  static user() {
    return user;
  }

  static connect() {
    client.connect();
  }

  static closeConnection() {
    client.end();
  }


  static initTestConfig() {
    client = new Client(testConfig);
  }

  static initProductionConfig() {
    client = new Client(productionConfig);
  }
}

export default DatabaseManager;

