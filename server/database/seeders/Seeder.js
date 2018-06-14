
import DatabaseManager from '../databaseManager';
import PasswordHasher from '../../helpers/PasswordHasher';

/**
 * A seeder contains static methods for seeding the database with new value
 */
export default class Seeder {
  /**
   * Seeds a client into the database and logs a result message
   * @param {object} user
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

  /**
   * This adds the defualt engineer into the database
   */
  static seedEngineer() {
    const passwordHash = PasswordHasher.hash(process.env.ENGINEER_PASSWORD || 'super123456');
    DatabaseManager.executeStream(`
      INSERT INTO "Engineers"(username, password, email, accessType)
        SELECT $1, $2,$3 , 'super'
          WHERE 0 =
            (
              SELECT COUNT(*) FROM "Engineers"
            );`, () => {
      console.log('Successfully seeded the engineer table');
    }, (err) => {
      console.log(err);
      console.log('Error while seeding the engineer table');
    }, [
      process.env.ENGINEER_USERNAME || 'superEngineer',
      passwordHash,
      process.env.ENGINEER_EMAIL || 'super@email.com',
    ]);
  }
}
