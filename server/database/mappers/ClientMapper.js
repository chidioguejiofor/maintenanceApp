import UserMapper from './UserMapper';
/**
 * This represents a single row in the "Clients" table in the database
 * A Client stores declares sql to be used for creating and updating to its
 * superclass
 */
export default class ClientMapper extends UserMapper {
  /**
    Creates a ClientMapper that can add the newClient supplied by the argument into the
    database. It can also be used to update an existing client if provided
  * @param {objet} newClient this is an object that represents data to be added in the
  * "Clients" table. Note that tnis object may contain only the specific columns that is
  * to be added in the system.
  * @param  {object} [existingClient] this optional parameter is would be used when updating
  * this Client. The
  */
  constructor(newClient, existingClient) {
    super(newClient, existingClient, 'Clients');
  }

  static loginQuery(username, password, callback, errorHandler) {
    super.loginQuery(username, password, 'Clients', callback, errorHandler);
  }
}

