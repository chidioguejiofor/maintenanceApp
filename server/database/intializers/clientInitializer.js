import databaseManager from '../../resourceManagers/databaseManager';
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

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "Clients" TO ${databaseManager.user()};
`;

const destroySql = 'DROP TABLE IF EXISTS  "Clients"';


class ClientInitializer extends Initializer {
  constructor() {
    super(createSql, destroySql, 'Client');
  }
}

export default new ClientInitializer();

