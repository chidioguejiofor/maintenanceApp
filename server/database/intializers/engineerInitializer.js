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


class EngineerInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'Engineer');
  }
}


export default new EngineerInitializer();
