
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.CONTACT_EMAIL, 
        pass: process.env.CONTACT_PASSWORD 
      }
    });

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.CONTACT_RECEIVER, // The owner's email
      subject: 'New Contact Form Message',
      text: `
New message from PALM contact form:

Name: ${firstName} ${lastName}
Email: ${email}
Message: ${message}
      `
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
});

module.exports = router;
