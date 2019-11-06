import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number()
        .min(0)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists) {
      return res
        .status(401)
        .json({ error: `Plan ${req.body.title} already exists.` });
    }

    const { title, duration, price } = await Plan.create(req.body);
    return res.json({ title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().min(1),
      price: Yup.number().min(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verifying if this plan exists
    const planExists = await Plan.findByPk(req.params.id);
    if (!planExists) {
      return res
        .status(404)
        .json({ error: `Plan ${req.params.id} does not exists.` });
    }

    // verifying if the title already exists
    if (req.body.title) {
      const titleExists = await Plan.findOne({
        where: { title: req.body.title },
      });
      if (titleExists) {
        return res
          .status(401)
          .json({ error: `Plan ${req.body.title} already exists!` });
      }
    }

    // if the planID exist and the title does not in use then update it
    const { id, title, duration, price } = await planExists.update(req.body);
    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const { id } = req.params;

    const planExists = await Plan.findByPk(id);

    if (!planExists) {
      return res.status(404).json({ error: 'This ID does not exist.' });
    }

    planExists.destroy();

    return res.status(200).json({
      message: `Plan ${planExists.title} deleted with success!`,
    });
  }

  async show(req, res) {
    const planID = req.params.id;

    if (!planID) {
      const plans = await Plan.findAll();
      return res.status(200).json(plans);
    }

    const plan = await Plan.findByPk(planID);

    if (!plan) {
      return res
        .status(404)
        .json({ error: `This plan (id = ${planID}) does not exists.` });
    }

    const { id, title, duration, price } = plan;

    return res.json({ id, title, duration, price });
  }
}
export default new PlanController();
