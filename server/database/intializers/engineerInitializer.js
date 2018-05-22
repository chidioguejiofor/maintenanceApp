import databaseManager from '../../resourceManagers/databaseManager';
import Initializer from './Initializer';

const createSql =
`CREATE TABLE "Engineers"
(
    username character varying(100),
    password character varying(255),
    email character varying(255),
    PRIMARY KEY (username)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE "Engineers"
    OWNER to postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Engineers" TO ${databaseManager.user()};
`;

const destroySql = 'DROP TABLE IF EXISTS  "Engineers"';


/**
 * EngineerInitializer is an {@link module:./Initializer}   that is used to
 * intialize the "Engineers" table in the database. It specifies the
 * create and destroy sql statements that is used in its superclass
 *
 *  @requires module:./Initializer
 */
class EngineerInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'Engineers');
  }
}


export default new EngineerInitializer();
