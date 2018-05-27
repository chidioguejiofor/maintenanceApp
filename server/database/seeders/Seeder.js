
import DatabaseManager from '../databaseManager';
import PasswordHasher from '../../helpers/PasswordHasher';

export default class Seeder {
  /**
   *
   * @param {*} user
   * @param {*} callback
   */
  static addClient(user) {
    const sql =
    `INSERT INTO "Clients"(username, password, email)
            VALUES($1, $2, $3)  RETURNING username, email`;

    const passwordHash = PasswordHasher.hash(user.password);
    DatabaseManager.executeQuery(
      sql,
      () => {
        console.log('Successfully seeded Clientes Table');
      },
      error => console.log('Error in seeding client', error),
      [user.username, passwordHash, user.email],
    );
  }

  static seedEngineer() {
    const passwordHash = PasswordHasher.hash('super123456');
    DatabaseManager.executeStream(`INSERT INTO "Engineers"(username, password, email, accessType)
    VALUES('superEngineer', $1, 'super@email.com', 'super');`, () => {
      console.log('Successfully seeded the engineer table');
    }, (err) => {
      console.log(err);
      console.log('Error while seeding the engineer table');
    }, [passwordHash]);
  }
}
