import Initializer from './Initializer';

const createSql =
`CREATE TABLE "Engineers"
(
    username character varying(100),
    password character varying(255),
    email character varying(255),
    accessType character varying(100),
    PRIMARY KEY (username)
);


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
    this.super = {
      username: 'superEngineer',
      password: 'super123456',
      email: 'super@email.com',
      accessType: 'super',
    };
  }
}


export default new EngineerInitializer();
