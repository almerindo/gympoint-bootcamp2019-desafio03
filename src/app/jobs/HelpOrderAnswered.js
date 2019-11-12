import Mail from '../lib/Mail';

export default {
  key: 'HelpOrderAnswered',
  options: {
    attemps: 3,
  },
  async handle({ data }) {
    const { name, email, id_helpOrder, question, answer } = data;

    await Mail.sendMail({
      from: 'Gynpoint Admin <enrollment@gympoint.com>',
      to: `${name} <${email}>`,
      subject: `The Question ${id_helpOrder} was answered`,
      html:
        `<p>Hello ${name} you have a new answer</p>` +
        `<br /> Question: ${question}` +
        `<br /> Answer: ${answer}`,
    });
  },
};
