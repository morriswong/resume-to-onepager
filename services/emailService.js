const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

async function sendEmail(to, subject, content) {
  try {
    await transporter.sendMail({
      from: config.email.user,
      to,
      subject,
      text: content,
    });
    return { success: true };
  } catch (error) {
    console.error('Email service error:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = { sendEmail }; 