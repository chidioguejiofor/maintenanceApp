import databaseManager from '../../resourceManagers/databaseManager';
import Initializer from './Initializer';

const createSql =
`CREATE TABLE "Requests"
(
    id integer,
    title character varying(100),
    description character varying(2000),
    location character varying(300),
    image character varying(400),
    "clientUsername" character varying(100),
    PRIMARY KEY (id),
    CONSTRAINT "clientUsernameConstraint" FOREIGN KEY ("clientUsername")
        REFERENCES "Clients" (username) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
WITH (
    OIDS = FALSE
);


GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Requests" TO ${databaseManager.user()};

`;

const destroySql = 'DROP TABLE IF EXISTS  "Requests"';


/**
 * ReqeustInitializer is an {@link module:./Initializer}   that is used to
 * intialize the "Reqeusts" table in the database. It specifies the
 * create and destroy sql statements that is used in its superclass
 *
 *  @requires module:./Initializer
 */
class ReqeustInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'Requests');
  }
}

export default new ReqeustInitializer();

