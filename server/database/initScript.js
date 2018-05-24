import clientInitializer from './intializers/clientInitializer';
import engineerInitializer from './intializers/engineerInitializer';
import requestInitializer from './intializers/requestInitializer';
import DatabaseManager from './DatabaseManager';


DatabaseManager.initProductionConfig();


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
