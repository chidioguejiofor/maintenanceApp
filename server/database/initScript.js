import clientInitializer from './intializers/clientInitializer';
import engineerInitializer from './intializers/engineerInitializer';
import requestInitializer from './intializers/requestInitializer';
import DatabaseManager from './databaseManager';


if (process.env.NODE_ENV === 'production') {
  DatabaseManager.initProductionConfig();
} else {
  DatabaseManager.initTestConfig();
}
export default function init() {
  requestInitializer.drop();
  clientInitializer.drop();
  engineerInitializer.drop();

  clientInitializer.create();
  engineerInitializer.create();
  requestInitializer.create();

  DatabaseManager.executeStream(`INSERT INTO "Engineers"(username, password, email, accessType)
          VALUES('superEngineer', 'super123456', 'super@email.com', 'super');`, () => {
    console.log('Successfully seeded the engineer table');
  }, (err) => {
    console.log(err);
    console.log('Error while seeding the engineer table');
  });
}
