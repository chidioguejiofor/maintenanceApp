import Initializer from './Initializer';

const createSql =
`CREATE TABLE "RequestStatus"
(
    "requestId" integer,
    status character varying(100),
    message character varying(100),
    "engineerUsermame" character varying(255),
    PRIMARY KEY ("requestId"),
    CONSTRAINT "requestRef" FOREIGN KEY ("requestId")
        REFERENCES "Requests" (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
);
`;
const destroySql = 'DROP TABLE IF EXISTS  "RequestStatus"';


/**
 * ReqeustStatusInitializer is an {@link module:./Initializer}   that is used to
 * intialize the "ReqeustStatus" table in the database. It specifies the
 * create and destroy sql statements that is used in its superclass
 *
 *  @requires module:./Initializer
 */
class ReqeustStatusInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'RequestStatus');
  }
}

export default new ReqeustStatusInitializer();
