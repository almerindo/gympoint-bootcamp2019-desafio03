import * as Yup from 'yup';
import Selquelize, { Op, fn } from 'sequelize';
import { parseISO, subDays } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    // Check id the student have a valid enrollment
    const now = new Date();
    const enrollment = await Enrollment.findOne({
      where: {
        canceled_at: null,
        student_id,
        start_date: {
          [Op.lte]: now,
        },
        end_date: {
          [Op.gte]: now,
        },
      },
    });

    if (!enrollment) {
      return res.status(400).json({
        error: `Student ${student_id} does not exists or enrollment invalid`,
      });
    }

    // Verifica se ultrapassou a qtdade de checkins no dia
    // O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.
    const dateLimit = subDays(now, process.env.CHECKIN_PERIOD);

    const count =
      (await Checkin.count({
        where: {
          student_id,
          created_at: {
            [Op.between]: [dateLimit, now],
          },
        },
      })) + 1;
    // count, pois começa de zero.
    if (count > process.env.CHECKIN_MAX_PERMITED) {
      return res.status(400).json({
        error:
          `Most of ${process.env.CHECKIN_MAX_PERMITED} checkins are not ` +
          ` permited in ${process.env.CHECKIN_PERIOD} days`,
      });
    }

    const { id, updated_at } = await Checkin.create({ student_id });
    return res.json({ id, student_id, updated_at, count });
  }

  async show(req, res) {
    const { student_id } = req.params;
    const students = await Checkin.findAll({
      where: {
        student_id,
      },
    });

    if (students.length === 0) {
      return res.status(404).json({
        error: `This student has never checked in or does not exists`,
      });
    }

    return res.json(students);
  }
}
export default new CheckinController();
