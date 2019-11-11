module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'help_orders',
      [
        {
          student_id: 1,
          question: 'Gostaria de um desconto de 30%',
          answer: null,
          answer_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
