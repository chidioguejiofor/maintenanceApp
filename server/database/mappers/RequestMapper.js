import TableMapper from './TableMapper';

const requestColumns = 'date , id, title, description, location, image, status, message';
/**
 * An ReqeustMapper makes inserting and updating rows in the "Reqeuests" table
 * easier and more convenient
 */
export default class ReqeustMapper extends TableMapper {
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
  update(clientUsername, callback, errorHandler) {
    const { newRequest, id } = this;
    const sql = `
      UPDATE "Requests"
        SET  title =$1, description=$2, location = $3, image =  $4, clientUsername =$5
      WHERE id = $6 RETURNING ${requestColumns};`;
    const values = [
      newRequest.title, newRequest.description,
      newRequest.location, newRequest.image,
      clientUsername, id,
    ];
    ReqeustMapper.executeUpdateHelper(sql, values, callback, errorHandler);
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
    ReqeustMapper.executeUpdateHelper(sql, [username], callback, errorHandler);
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
    ReqeustMapper.executeUpdateHelper(sql, [username, id], callback, errorHandler);
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
    ReqeustMapper.executeUpdateHelper(sql, [], callback, errorHandler);
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
    ReqeustMapper.executeUpdateHelper(sql, [newStatus, requestId], callback, errorHandler);
  }
}

