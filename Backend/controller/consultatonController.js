const nodemailer = require('nodemailer');
const Consultation = require('../models/consulatation')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  }
});

exports.createConsultation = async (req, res) => {
  try {
    const { userName, userEmail, userPhone, preferredDate, preferredTime, notes } = req.body;

    if (!userName || !userEmail || !userPhone) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const consult = new Consultation({ userName, userEmail, userPhone, preferredDate, preferredTime, notes });
    await consult.save();

  
    await transporter.sendMail({
      from: `"Website" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '📝 New Consultation Booked',
      html: `
        <h2>New Consultation</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Phone:</strong> ${userPhone}</p>
        <p><strong>Date:</strong> ${preferredDate}</p>
        <p><strong>Time:</strong> ${preferredTime}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
      `
    });

    res.status(201).json({ success: true, message: 'Consultation booked', data: consult });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error booking consultation', error: err.message });
  }
};

exports.getAllConsultations = async (req, res) => {
    try {
      const consultations = await Consultation.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: consultations });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch consultations', error: err.message });
    }
  };
  