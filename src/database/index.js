import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Students from '../app/models/Student';
import Users from '../app/models/User';
import Plans from '../app/models/Plan';
import Enrollments from '../app/models/Enrollment';
import Chekins from '../app/models/Checkin';

const models = [Students, Users, Plans, Enrollments, Chekins];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // Chamando o metodo init de todos os models
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
