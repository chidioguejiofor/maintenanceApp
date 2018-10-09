import clientInitializer from './intializers/clientInitializer';
import engineerInitializer from './intializers/engineerInitializer';
import requestInitializer from './intializers/requestInitializer';
import DatabaseManager from './databaseManager';

if (process.env.NODE_ENV === 'production') {
  DatabaseManager.initProductionConfig();
} else {
  DatabaseManager.initTestConfig();
}

requestInitializer.drop();
clientInitializer.drop();
engineerInitializer.drop();

