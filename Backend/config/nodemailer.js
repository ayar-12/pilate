const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or "Outlook", "Yahoo", etc.
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: process.env.SENDER_EMAIL, // send it to yourself just to test
  subject: '✅ Nodemailer is working',
  text: 'If you received this, your email setup is working.',
}, (err, info) => {
  if (err) {
    console.error('Email sending failed:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
