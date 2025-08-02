import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer setup error:', error);
  } else {
    console.log('✅ Nodemailer is ready to send messages');
  }
});

export default transporter;
