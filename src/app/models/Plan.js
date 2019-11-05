import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.DATE,
        price: Sequelize.DECIMAL(8, 2),
      },
      {
        sequelize,
      }
    );
  }
}
export default Plan;
