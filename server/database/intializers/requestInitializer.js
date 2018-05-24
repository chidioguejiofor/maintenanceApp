import Initializer from './Initializer';

const createSql =
`CREATE TABLE "Requests"
(
    id SERIAL,
    title character varying(100),
    description character varying(2000),
    location character varying(300),
    image character varying(400),
    status character varying(100) DEFAULT 'created',
    message character varying(1000) DEFAULT 'none',
    clientusername character varying(100),
    date date DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT "clientUsernameConstraint" FOREIGN KEY (clientusername)
        REFERENCES "Clients" (username) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);



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

