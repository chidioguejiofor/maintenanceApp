import DatabaseManager from '../../database/DatabaseManager';
import Initializer from './Initializer';

const createSql =
`CREATE TABLE "Clients"
(
    username character varying(100),
    password character varying(255),
    email character varying(255),
    PRIMARY KEY (username)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE "Clients"
    OWNER to postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Clients" TO ${DatabaseManager.user()};
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

