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

class ReqeustStatusInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'RequestStatus');
  }
}

export default new ReqeustStatusInitializer();
