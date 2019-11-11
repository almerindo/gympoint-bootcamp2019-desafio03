module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'enrollments',
      [
        {
          student_id: 1,
          plan_id: 3,
          start_date: '2019-11-10T16:59:00.000Z',
          end_date: '2020-05-10T16:59:00.000Z',
          price: 6 * 89,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
