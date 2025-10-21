const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Faisal Ghafoor <faisal@test.com>',
    to: options.email,
    subject: options.subject,
    text: options.text || options.message,
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Email sent successfully');
};

module.exports = sendMail;
