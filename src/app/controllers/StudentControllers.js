import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .min(0)
        .max(150)
        .required(),
      weight: Yup.number()
        .positive()
        .min(0)
        .max(300)
        .required(),
      height: Yup.number()
        .positive()
        .min(0)
        .max(3)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res
        .status(401)
        .json({ error: `Student ${req.body.email} already exists.` });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );
    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .min(0)
        .max(150),
      weight: Yup.number()
        .positive()
        .min(0)
        .max(300),
      height: Yup.number()
        .positive()
        .min(0)
        .max(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Student.findByPk(req.studentID);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'This email already exists.' });
      }
    }

    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({ id, name, age, weight, height });
  }

  async delete(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findOne({ where: { id } });

    if (!studentExists) {
      return res.status(404).json({ error: 'This ID does not exist.' });
    }

    studentExists.destroy();

    return res.status(200).json({
      message: `Student ${studentExists.email} deleted with success!`,
    });
  }

  async show(req, res) {
    const studentID = req.params.id;

    if (!studentID) {
      const students = await Student.findAll();
      return res.status(200).json(students);
    }

    const student = await Student.findByPk(studentID);

    if (!student) {
      return res.status(404).json({ error: 'This student does not exists.' });
    }

    const { id, name, email, age, weight, height } = student;

    return res.json({ id, name, email, age, weight, height });
  }
}
export default new StudentController();
