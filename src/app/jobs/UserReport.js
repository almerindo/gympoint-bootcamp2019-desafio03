export default {
  key: 'UserReport',
  options: {
    delay: 5000,
    // repeat: {
    //   every: 10000,
    //   limit: 5,
    // },
  },
  async handle({ data }) {
    const { name, email, plan_name, end_date, price } = data;
    console.log(name, email, plan_name, end_date, price);
    return 'OK';
  },
};
