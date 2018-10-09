import clientInitializer from './intializers/clientInitializer';
import engineerInitializer from './intializers/engineerInitializer';
import requestInitializer from './intializers/requestInitializer';
import DatabaseManager from './databaseManager';
import Seeder from '../database/seeders/Seeder';

if (process.env.NODE_ENV === 'production') {
  DatabaseManager.initProductionConfig();
} else {
  DatabaseManager.initTestConfig();
}
export default function init() {
  if (process.env.NODE_ENV !== 'production') {
    requestInitializer.drop();
    clientInitializer.drop();
    engineerInitializer.drop();
  }
  clientInitializer.create();
  engineerInitializer.create();
  requestInitializer.create();
  Seeder.seedEngineer();
  DatabaseManager.setPoolMaxSize(4);
}
