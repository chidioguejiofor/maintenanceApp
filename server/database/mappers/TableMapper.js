import DatabaseManager from '../databaseManager';


/**
 * A {@code TableMapper } is used to link an sql table to a javascript object
 * This is supposed to make it easier to insert new table rows in the database.
 *This is an abstract class and should not be instantiated
 */
export default class TableMapper {
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

  /**
 * This helper functions is used to execute updates on the different TableMappers
 * @param {string} sql
 * @param {string} values
 * @param {function} callback
 * @param {function} errorHandler
 */
  static executeUpdateHelper(sql, values, callback, errorHandler) {
    DatabaseManager.executeStream(sql, callback, errorHandler, values);
  }
}
