import Sequelize, { Model, Op } from 'sequelize';
import Plan from './Plan';
import Student from './Student';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(8, 2),
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }

  static findAllNotCanceled() {
    return this.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'price', 'start_date', 'end_date'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  static getById(key) {
    return this.findOne({
      where: {
        canceled_at: null,
        id: key,
      },
      attributes: ['id', 'price', 'start_date', 'end_date'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  static checkIfOverlaps(startDate, endDate) {
    return (
      Enrollment.count({
        where: {
          canceled_at: null,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              end_date: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        },
      }) > 0
    );
  }
}
export default Enrollment;
