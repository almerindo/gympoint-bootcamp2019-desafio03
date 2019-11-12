import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../lib/Queue';

class HelpOrderAnswerController {
  async store(req, res) {
    const { id } = req.params;

    // valida se o ID está presente
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Verifica se answer está presente
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json(`Answer must be informed`);
    }

    const helpOrder = await HelpOrder.findByPk(id);
    if (!helpOrder) {
      return res.status(400).json(`HelpOrder ID: ${id} does not exists`);
    }

    helpOrder.answer = answer;
    helpOrder.updated_at = new Date();
    await helpOrder.save();
    const { name, email } = await Student.findByPk(helpOrder.student_id);

    await Queue.add('HelpOrderAnswered', {
      name,
      email,
      id_helpOrder: helpOrder.id,
      question: helpOrder.question,
      answer,
    });
    return res.json();
  }
}
export default new HelpOrderAnswerController();
