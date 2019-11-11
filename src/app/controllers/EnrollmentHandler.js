import * as Yup from 'yup';
import { parseISO, addMonths, isBefore, startOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

import Queue from '../lib/Queue';

// FIXME Melhorar codigo de Enrollments

class EnrollmentHandle {
  async calcEndDate(start_date, duration) {
    return addMonths(start_date, duration);
  }

  async check(req) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
      plan_id: Yup.number()
        .min(0)
        .required(),
    });

    // check if the req.body is valid
    if (!(await schema.isValid(req.body))) {
      return { cod: 401, payload: 'Validation fails' };
    }

    // check if is in the past
    const start_date = parseISO(req.body.start_date);
    if (isBefore(startOfDay(start_date), startOfDay(new Date()))) {
      return { cod: 401, payload: 'Past dates are not permited' };
    }

    // check if student exist
    const student = await Student.findByPk(req.body.student_id);
    if (!student) {
      return {
        cod: 404,
        payload: `Student ID ${req.body.student_id} does not extists.`,
      };
    }

    // check if the plan exist
    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) {
      return {
        cod: 404,
        payload: `Plan ID ${req.body.plan_id} does not extists.`,
      };
    }

    // calc end_date and Check if overlap some active enroolment
    const end_date = addMonths(start_date, plan.duration);

    const overlaps = await this.isEnrollmentExists(
      req.body.student_id,
      start_date,
      end_date
    );
    if (overlaps) {
      return {
        cod: 400,
        payload:
          `The interval (Start: ${start_date}  / End: ${end_date})` +
          ` Overlaps a active enrollment `,
      };
    }

    const payload = { student, plan, start_date, end_date };
    // if all ok, then return
    return { cod: 200, payload };
  }

  async isEnrollmentExists(student_id, startDate, endDate) {
    const existsEnrollment = await Enrollment.count({
      where: {
        student_id,
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
