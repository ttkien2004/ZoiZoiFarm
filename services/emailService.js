const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Cấu hình nội dung
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,      
    subject, 
    text,    
  };

  // Gửi mail
  let info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);
}

module.exports = { sendEmail };
