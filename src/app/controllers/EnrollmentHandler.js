import * as Yup from 'yup';
import { parseISO, addMonths, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

import Queue from '../lib/Queue';

class EnrollmentHandle {
  async calcEndDate(start_date, duration) {
    return addMonths(parseISO(start_date), duration);
  }

  async check(req) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
      plan_id: Yup.number()
        .min(0)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return { cod: 401, value: 'Validation fails' };
    }

    const start_date = parseISO(req.body.start_date);
    if (isBefore(start_date, new Date())) {
      return { cod: 401, value: 'Past dates are not permited' };
    }

    const student = await Student.findByPk(req.body.student_id);
    if (!student) {
      return {
        cod: 404,
        value: `Student ID ${req.body.student_id} does not extists.`,
      };
    }

    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) {
      return {
        cod: 404,
        value: `Plan ID ${req.body.plan_id} does not extists.`,
      };
    }

    return { cod: 200, student, plan };
  }

  async isEnrollmentExists(startDate, endDate) {
    const existsEnrollment = await Enrollment.count({
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
    });
    return existsEnrollment > 0;
  }

  async add(data) {
    const { start_date, end_date, price, student, plan } = data;
    // Store
    // TODO Melhorar o Enrolment para já retornar um objeto com suas associacoes
    // Deveria addicionar e colocar a option include...
    const enrollment = await Enrollment.create({
      start_date,
      end_date,
      price,
      student_id: student.id,
      plan_id: plan.id,
    });

    // send email in background
    const { name, email } = student;
    const { title } = plan;

    await Queue.add('EnrollmentMail', {
      name,
      email,
      title,
      price,
      end_date,
      start_date,
    });
    return enrollment;
  }
}

export default new EnrollmentHandle();
