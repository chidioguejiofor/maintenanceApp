import Initializer from './Initializer';

const createSql =
`CREATE TABLE IF NOT EXISTS "Clients"
(
    username character varying(100),
    password character varying(10000),
    email character varying(255),
    CONSTRAINT clientuniqueMail UNIQUE (email),
    PRIMARY KEY (username)
);



`;

const destroySql = 'DROP TABLE IF EXISTS  "Clients"';


/**
 * ClientInitializer is an {@link module:./Initializer}   that is used to
 * intialize the "Clients" table in the database. It specifies the
 * create and destroy sql statements that is used in its superclass
 *
 *  @requires module:./Initializer
 */
class ClientInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'Clients');
  }
}

export default new ClientInitializer();

