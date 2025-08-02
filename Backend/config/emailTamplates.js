export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #f4f3ee;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 540px;
      margin: 60px 0;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #2f4239;
    }

    .main-content h1 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #445b50;
      margin-bottom: 20px;
    }

    .main-content p {
      font-size: 15px;
      line-height: 1.6;
      color: #555;
    }

    .highlight {
      color: #4C83EE;
      font-weight: 600;
    }

    .button {
      background: #A8CABA;
      border-radius: 8px;
      color: #fff;
      padding: 14px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 30px 0;
      display: block;
      text-decoration: none;
      letter-spacing: 4px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }

      .button {
        font-size: 16px;
        padding: 12px;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f4f3ee">
    <tr>
      <td align="center">
        <table class="container" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="main-content">
              <h1>Verify Your Email</h1>
              <p>Hi there,</p>
              <p>You’re almost ready to start your wellness journey. Please confirm your email for <span class="highlight">{{email}}</span>.</p>
              <p>Use the OTP below to verify your account:</p>
              <div class="button">{{otp}}</div>
              <p>This OTP is valid for 24 hours.</p>
              <p>If you didn’t request this, you can safely ignore this email.</p>
              <p style="margin-top: 40px; font-size: 13px; color: #999;">&copy; 2025 Your Pilates Studio — Find your flow.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`;
export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #f4f3ee;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 540px;
      margin: 60px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #2f4239;
    }

    .main-content h1 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #445b50;
      margin-bottom: 20px;
    }

    .main-content p {
      font-size: 15px;
      line-height: 1.6;
      color: #555;
    }

    .highlight {
      color: #4C83EE;
      font-weight: 600;
    }

    .button {
      background: #A8CABA;
      border-radius: 8px;
      color: #fff;
      padding: 14px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 30px 0;
      display: block;
      text-decoration: none;
      letter-spacing: 4px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }

      .button {
        font-size: 16px;
        padding: 12px;
      }
    }
  </style>
</head>

<body>
  <table width="100%" bgcolor="#f4f3ee">
    <tr>
      <td align="center">
        <table class="container">
          <tr>
            <td class="main-content">
              <h1>Reset Your Password</h1>
              <p>Hi there,</p>
              <p>We received a password reset request for your account: <span class="highlight">{{email}}</span>.</p>
              <p>Use the OTP below to reset your password:</p>
              <div class="button">{{otp}}</div>
              <p>This OTP is valid for 15 minutes.</p>
              <p>If you didn’t request this, no worries — just ignore this email.</p>
              <p style="margin-top: 40px; font-size: 13px; color: #999;">&copy; 2025 Your Pilates Studio — Strong body, peaceful mind.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`;
export const WELCOME_EMAIL_TEMPLATE = (name, email, phone) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Yoga Courses</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f6f0ed;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
    <h1 style="color: #74512D; text-align: center;">🧘‍♀️ Welcome to Yoga Courses!</h1>
    <h2 style="color: #74512D;">Hello ${name}! 👋</h2>
    <p>Thank you for joining our yoga community!</p>
    <div style="background-color: #fff8f1; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    </div>
    <p>You can now access all our yoga courses and meditation sessions!</p>
    <p style="text-align: center; color: #74512D; font-style: italic;">
      "Yoga is not about touching your toes. It is about what you learn on the way down." 🙏
    </p>
    <p style="text-align: center;">Namaste 🙏</p>
  </div>
</body>
</html>
`;