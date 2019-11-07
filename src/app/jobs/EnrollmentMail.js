import Mail from '../lib/Mail';

export default {
  key: 'EnrollmentMail',
  options: {
    attemps: 3,
  },
  async handle({ data }) {
    // TODO configurar corretamente a captura dos dados
    const { name, email, plan_name, end_date, price } = data;

    await Mail.sendMail({
      from: 'Gynpoint Admin <enrollment@gympoint.com>',
      to: `${name} <${email}>`,
      subject: 'New Enrollment',
      html: `<p>Olá ${name} você tem uma nova matricula!</p> <br /> Plano: ${plan_name} <br /> Data de Termino: ${end_date} <br /> Valor total: ${price}`,
    });
  },
};
