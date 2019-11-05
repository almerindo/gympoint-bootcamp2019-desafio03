module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      weight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },

      height: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('students');
  },
};

// name: Sequelize.STRING,
// email: Sequelize.STRING,
// // age: Sequelize.INTEGER,
// // weight: Sequelize.FLOAT(3, 2),
// // height: Sequelize.FLOAT(1, 2),
// age: Sequelize.STRING,
// weight: Sequelize.STRING,
// height: Sequelize.STRING,
