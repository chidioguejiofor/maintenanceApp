import databaseManager from '../../resourceManagers/databaseManager';

class Initializer {
  constructor(createSql, destroySql, modelName) {
    this.createSql = createSql;
    this.destroySql = destroySql;
    this.modelName = modelName;
  }

  create(end) {
    databaseManager.executeQuery(this.createSql, () => {
      console.log(`Successfully created ${this.modelName} table`);
      if (end) {
        databaseManager.closeConnection();
      }
    }, (err) => {
      console.log(`An error occured while creating table ${this.modelName} table`);
      console.log(err.message);
    });
  }

  drop(end) {
    databaseManager.executeQuery(this.destroySql, () => {
      console.log(`Successfully deleted ${this.modelName} table`);
      if (end) databaseManager.closeConnection();
    }, (err) => {
      console.log(`An error occured while droping table ${this.modelName} table`);
      console.log(err.message);
    });
  }
}


export default Initializer;

