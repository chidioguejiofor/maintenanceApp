import TableMapper from './TableMapper';

const requestColumns = 'date , id, title, description, location, image, status, message, clientusername AS "clientUsername"';
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
                      VALUES($1, $2, $3, $4, $5 ) RETURNING ${requestColumns};`,
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
  static getByUsernameAndId(username, id, callback, errorHandler) {
    const sql =
      `SELECT ${requestColumns}  FROM "Requests"
          WHERE clientusername = $1 AND id = $2 `;
    ReqeustMapper.executeUpdateHelper(sql, [username, id], callback, errorHandler);
  }


  static getById(id, callback, errorHandler) {
    const sql =
      `SELECT ${requestColumns}  FROM "Requests"
          WHERE  id = $1 `;
    ReqeustMapper.executeUpdateHelper(sql, [id], callback, errorHandler);
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
  static getAll(date = new Date(), callback, errorHandler) {
    let fromDate = date;
    if (fromDate === null) fromDate = new Date();
    fromDate.setHours(0, 0, 0);
    const sql =
      `SELECT ${requestColumns}  FROM "Requests"
      WHERE  $1 <= date
      ORDER BY date`;
    ReqeustMapper.executeUpdateHelper(sql, [fromDate], callback, errorHandler);
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
  static updateStatus(requestId, newStatus, message, callback, errorHandler) {
    const sql =
      `UPDATE  "Requests" SET status = $1, message = $3
        WHERE id = $2  
        RETURNING  ${requestColumns}`;
    ReqeustMapper.executeUpdateHelper(sql, [newStatus, requestId, message], callback, errorHandler);
  }

  /**
   * Queries the database for statistics of the requests in the system and calls the
   * callback with its requests
    @param {function callback(result) {
        called with the result of the query. Note that this result is an object that contains
        rows, rowcount etc
     }} callback
     * @param {function errorHandler(sqlError) {
        called when an error occurs. It takes the error object as its argument
     }} errorHandler
   */
  static getStats(callback, errorHandler) {
    const sql =
      ` SELECT COUNT(*) AS "totalRequests", 
               COUNT(status)  FILTER (where status= 'approved') as approved,
               COUNT(status) FILTER (where status= 'disapproved') as disapproved,
               COUNT(status) FILTER (where status= 'resolved') as resolved,
               COUNT(status) FILTER (where status= 'resolved' OR status= 'disapproved' OR status= 'approved') as responded,
               COUNT(status) FILTER (where status= 'pending') as "notResponded"
        FROM "Requests";
      `;
    ReqeustMapper.executeUpdateHelper(sql, [], callback, errorHandler);
  }
}

