import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';

import Queue from '../lib/Queue';

// TODO Codificar o CRUD
class EnrollmentController {
  async store(req, res) {
    // FIXME Capturar o plano escolhido e data de inicio
    const { date, plan_id } = req.body; // 23/05/2019
    // FIXME Calcular data de termino e valor total
    const name = 'Almerindo';
    const email = 'almerindo@gmail.com';
    const plan_name = 'GOLD';
    const end_date = '11/11/2000';
    const price = 590.0;
    // FIXME

    // TODO Adicionar JOB para envio de e-mail
    await Queue.add('EnrollmentMail', {
      name,
      email,
      plan_name,
      end_date,
      price,
    });

    await Queue.add('UserReport', {
      name,
      email,
      plan_name,
      end_date,
      price,
    });

    return res.json();
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }

  async show(req, res) {
    return res.json();
  }
}
export default new EnrollmentController();
