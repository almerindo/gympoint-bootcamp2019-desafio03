import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async show(req, res) {
    const helporders = await HelpOrder.findAll();
    return res.json(helporders);
  }

  async store(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json(`Student ID: ${id} does not exists`);
    }

    const { question } = req.body;
    if (!question) {
      return res.status(400).json(`Question must be informed`);
    }

    return res.json(await HelpOrder.create({ student_id: id, question }));
  }
}
export default new HelpOrderController();
