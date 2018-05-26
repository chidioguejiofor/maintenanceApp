
import DatabaseManager from '../databaseManager';
import PasswordHasher from '../../helpers/PasswordHasher';

export default class Seeder {
  static addClient(user) {
    const sql =
    `INSERT INTO "Clients"(username, password, email)
            VALUES($1, $2, $3)`;

    const passwordHash = PasswordHasher.hash(user.password);
    DatabaseManager.executeStream(
      sql,
      () => console.log('Successfully seeded clients'),
      error => console.log('Error in seeding client', error),
      [user.username, passwordHash, user.email],
    );
  }

  static seedEngineer() {
    const passwordHash = PasswordHasher.hash('super123456');
    DatabaseManager.executeStream(`INSERT INTO "Engineers"(username, password, email, accessType)
    VALUES('superEngineer', '$1', 'super@email.com', 'super');`, () => {
      console.log('Successfully seeded the engineer table');
    }, (err) => {
      console.log(err);
      console.log('Error while seeding the engineer table');
    }, [passwordHash]);
  }
}
