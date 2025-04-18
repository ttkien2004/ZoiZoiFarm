// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"ZoiZoi Farm" <${process.env.EMAIL_USER}>`,
      to, subject, text,
    });
    console.log('Email sent:', info.messageId);
    console.log(`Đã gửi mail tới ${info.accepted.join(', ')} – id: ${info.messageId}`);
  } catch (err) {
    console.error('Send mail error:', err);
  }
}

module.exports = { sendEmail };
