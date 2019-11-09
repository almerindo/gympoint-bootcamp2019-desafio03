import { parseISO } from 'date-fns';

import EnrollmentHandler from './EnrollmentHandler';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
// TODO Codificar o CRUD
class EnrollmentController {
  async store(req, res) {
    const msg = await EnrollmentHandler.check(req);

    if (msg.cod !== 200) {
      return res.status(msg.cod).json(msg.value);
    }

    const end_date = await EnrollmentHandler.calcEndDate(
      req.body.start_date,
      msg.plan.duration
    );

    if (
      await EnrollmentHandler.isEnrollmentExists(
        parseISO(req.body.start_date),
        end_date
      )
    ) {
      return res.status(400).json('Enrollment already exists or is active');
    }
    // Calcula preco total
    const price = msg.plan.duration * msg.plan.price;

    const enroll = await EnrollmentHandler.add({
      start_date: req.body.start_date,
      end_date,
      price,
      student: msg.student,
      plan: msg.plan,
    });
    return res.status(msg.cod).json(enroll);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }

  async show(req, res) {
    const enrollmentID = req.params.id;

    if (!enrollmentID) {
      const enrollments = await Enrollment.findAll({
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
      return res.status(200).json(enrollments);
    }

    // const enrollment = await Enrollment.findByPk(enrollmentID);
    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentID },
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
    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'This enrollment does not exists.' });
    }

    return res.json(enrollment);
  }
}
export default new EnrollmentController();
