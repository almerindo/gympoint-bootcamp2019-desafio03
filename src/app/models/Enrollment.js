import Sequelize, { Model } from 'sequelize';
import { differenceInDays } from 'date-fns';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(8, 2),

        // TODO fazer um JOB que olha todos os dias os alunos que estão perto de
        // vencer a matricula e manda um email avisando
        countDays: {
          type: Sequelize.VIRTUAL,
          get() {
            return differenceInDays(this.start_date, this.end_date);
          },
        },
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
}
export default Enrollment;
