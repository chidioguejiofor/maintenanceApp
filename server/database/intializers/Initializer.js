/* eslint-disable no-console */
import DatabaseManager from '../../database/databaseManager';

/**
 * An intializer encapsulates logic for creating and droping a table in the
 * database. This class contains code that which its subclasses use to create
 * and drop a specific table in the database.
 */
class Initializer {
  /**
   * This constructor must be called by all subclasses of this class. It specifies the
   * name of the tables and sql queries
   * @param {string} createSql  must be a valid sql statement that creates a table
   * @param {string} destroySql must be a valid sql statement that drops/deletes a table
   * @param {string} modelName the name of the table
   */
  constructor(createSql, destroySql, modelName) {
    this.createSql = createSql;
    this.destroySql = destroySql;
    this.modelName = modelName;
  }


  /**
   * Creates the database using the data provided by the concrete implementation
   * It logs success messages and errors if any occured
   */
  create() {
    DatabaseManager.executeQuery(this.createSql, () => {
      console.log(`Successfully created "${this.modelName}" table`);
    }, (err) => {
      console.log(`An error occured while creating table "${this.modelName}" table`);
      console.log(err.message);
    });
  }

  /**
   * This method drops/deletes a  table by executing the sql statement
   * specified in the constructor. It takes a boolean that specifies whether
   * or not the connection should be closed once the operation is successful
   * @param {Boolean} closeConnection
   */
  drop(closeConnection) {
    DatabaseManager.executeQuery(this.destroySql, () => {
      console.log(`Successfully deleted "${this.modelName}" table`);
      if (closeConnection) DatabaseManager.closeConnection();
    }, (err) => {
      console.log(`An error occured while droping table" ${this.modelName}" table`);
      console.log(err.message);
    });
  }
}


export default Initializer;

