import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Students from '../app/models/Student';
import Users from '../app/models/User';
import Plans from '../app/models/Plan';

const models = [Students, Users, Plans];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // Chamando o metodo init de todos os models
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
