const axios = require('axios');

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!process.env.BREVO_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Missing BREVO_API_KEY in environment variables');
    }
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  const brevoHeaders = {
    'api-key': process.env.BREVO_API_KEY,
    'Content-Type': 'application/json',
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📩 Adding contact to Brevo list...');
    }

    await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        listIds: [2],
        updateEnabled: true,
      },
      { headers: brevoHeaders }
    );

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "PALM",
          email: process.env.SENDER_EMAIL || "info@yourdomain.com", // ✅ pull from env
        },
        to: [{ email }],
        templateId: 10,
        params: {
          FIRSTNAME: email.split('@')[0],
          EMAIL: email,
        },
      },
      { headers: brevoHeaders }
    );

    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully! Check your inbox.',
    });

  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Brevo API error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    }

    const status = err.response?.status;

    if (status === 401) {
      return res.status(500).json({ success: false, message: 'Email service auth failed' });
    }

    if (status === 400) {
      return res.status(400).json({ success: false, message: err.response?.data?.message || 'Bad request' });
    }

    if (status === 404) {
      return res.status(500).json({ success: false, message: 'Email template or list not found' });
    }

    return res.status(500).json({ success: false, message: 'Subscription failed. Try again later.' });
  }
};
