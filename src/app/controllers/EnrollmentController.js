import * as Yup from 'yup';
import EnrollmentHandler from './EnrollmentHandler';
import Enrollment from '../models/Enrollment';

class EnrollmentController {
  async store(req, res) {
    // Do many tests and return msg cod and payload
    const msg = await EnrollmentHandler.check(req);
    const { cod, payload } = msg;
    if (cod !== 200) {
      return res.status(cod).json(payload);
    }

    // Calcula preco total
    const price = payload.plan.duration * payload.plan.price;

    // Create a enrollment and add on Queue Jobs to sendmail
    const enroll = await EnrollmentHandler.add({
      start_date: payload.start_date,
      end_date: payload.end_date,
      price,
      student: payload.student,
      plan: payload.plan,
    });
    return res.status(cod).json(enroll);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      price: Yup.number(),
    });

    // check if the req.body is valid
    if (!(await schema.isValid(req.body))) {
      return { cod: 401, payload: 'Validation fails' };
    }

    const { idEnroll } = req.params;

    const enrollmentExist = await Enrollment.findByPk(idEnroll);

    if (!enrollmentExist) {
      return res
        .status(404)
        .json({ error: 'This enrollment does not exists.' });
    }

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
    } = await enrollmentExist.update(req.body);

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const enrollmentExists = await Enrollment.getById(id);

    if (!enrollmentExists) {
      return res.status(404).json({ error: `The ID ${id} does not exist.` });
    }

    enrollmentExists.canceled_at = new Date();
    enrollmentExists.save();

    // enrollmentExists.destroy();
    return res.status(200).json({
      message: `Enrollment ${id} deleted with success!`,
    });
  }

  // TODO COlocar paginação
  async show(req, res) {
    const enrollmentID = req.params.id;

    if (!enrollmentID) {
      return res.status(200).json(await Enrollment.findAllNotCanceled());
    }

    // const enrollment = await Enrollment.findByPk(enrollmentID);
    const enrollment = await Enrollment.getById(enrollmentID);
    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'This enrollment does not exists.' });
    }

    return res.json(enrollment);
  }
}
export default new EnrollmentController();
