import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Students from '../app/models/Student';
import Users from '../app/models/User';

const models = [Students, Users];

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
