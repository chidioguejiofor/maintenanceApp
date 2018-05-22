import clientInitializer from './intializers/clientInitializer';
import engineerInitializer from './intializers/engineerInitializer';
import requestInitializer from './intializers/requestInitializer';
import requestStatusInitializer from './intializers/requestStatusInitializer';
import DatabaseManager from '../resourceManagers/databaseManager';


DatabaseManager.initProductionConfig();

DatabaseManager.connect();

requestStatusInitializer.drop();
requestInitializer.drop();
clientInitializer.drop();
engineerInitializer.drop();

clientInitializer.create();
engineerInitializer.create();
requestInitializer.create();
requestStatusInitializer.create(true);

