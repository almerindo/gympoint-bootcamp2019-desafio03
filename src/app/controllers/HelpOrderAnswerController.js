import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

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

    return res.json(await helpOrder.save());
  }
}
export default new HelpOrderAnswerController();
