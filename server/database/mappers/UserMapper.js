import TableMapper from './TableMapper';
/**
 * This represents a single row in the "Clients" table in the database
 * A Client stores declares sql to be used for creating and updating to its
 * superclass
 */
export default class UserMapper extends TableMapper {
  /**
       *This consstructor intialises this Client by creating an sqlObject and
       sending it to the super class. The sqlObject attributes for creating
       and updating the "Clients" table in the database.
       Client attributes include username, password and email with username being the
       primary key
       * @param {objet} newUser this is an object that represents data to be added in the
       * "Clients" table. Note that tnis object may contain only the specific columns that is
       * to be added in the system.
       * @param  {object} [existingUser] this optional parameter is would be used when updating
       * this User
       */
  constructor(newUser, existingUser, tableName) {
    const obj = {
      create: {
        sql:
                `INSERT INTO "${tableName}"(username, password, email)
                    VALUES($1, $2, $3) RETURNING username, email`,
        values: [newUser.username, newUser.password, newUser.email],

      },
    };
    super(obj);
    this.newUser = newUser;
    this.existingUser = existingUser;
    this.tableName = tableName;
  }

  static loginQuery(username, password, tableName, callback, errorHandler) {
    const sql = `SELECT username, email FROM "${tableName}" 
                    WHERE username = $1 AND password = $2`;

    UserMapper.executeUpdateHelper(sql, [username, password], callback, errorHandler);
  }


  static findByMail(email, tableName, callback, errorHandler) {
    const sql = `SELECT username, email FROM "${tableName}" 
            WHERE email = $1; `;

    UserMapper.executeUpdateHelper(sql, [email], callback, errorHandler);
  }

  static updatePassword(user, tableName, callback, errorHandler) {
    const sql =
    `UPDATE "${tableName}" 
        SET  password = $1
        WHERE email = $2 AND username =$3 RETURNING username, email;`;
    const values = [user.password, user.email, user.username];
    UserMapper.executeUpdateHelper(sql, values, callback, errorHandler);
  }
}

