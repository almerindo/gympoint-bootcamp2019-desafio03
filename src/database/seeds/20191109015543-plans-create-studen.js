module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Student 01',
          email: 'student@gmail.com',
          age: 18,
          weight: 72.3,
          height: 1.8,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
