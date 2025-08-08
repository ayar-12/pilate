const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // ✅ THIS IS WHAT'S MISSING

const userModel = require('../models/user');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  }
});


const {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} = require('../config/emailTamplates');
require('dotenv').config();

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const register = async (req, res) => {
  const { name, email, password, phone, age, photo, adminCode } = req.body;

  if (!name || !email || !password || !phone || !age)
    return res.json({ success: false, message: 'Missing required details' });

  if (password.length < 6 || phone.length < 6)
    return res.json({ success: false, message: 'Password and phone must be at least 6 characters long' });

  if (isNaN(Number(age)) || Number(age) > 120)
    return res.json({ success: false, message: 'Age must be a number and realistic' });

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const user = new userModel({
      name,
      email,
      phone,
      age,
      role: (adminCode === process.env.ADMIN_SECRET) ? 'admin' : 'user',
      photo: photo || '',
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();
    const token = createToken(user._id);
     res.cookie('token', token, {
      httpOnly: true,
      secure: true,        // must be true for cross-site HTTPS
      sameSite: 'none',    // allow cookies between pilate-1 and pilate-2
      // domain: '.onrender.com', // uncomment if you want it shared across subdomains
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

 // 1. Send welcome email
await transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: 'Welcome to Yoga Courses! 🧘‍♀️',
  html: WELCOME_EMAIL_TEMPLATE(name, email, phone)
});

// 2. Send OTP verification email
await transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: 'Account Verification OTP',
  html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', email)
});


    return res.json({ success: true, userId: user._id });
  } catch (error) {
    console.error('Register error:', error);
    return res.json({ success: false, message: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: 'Email and password are required' });

  try {
  const user = await userModel.findOne({ email });

if (!user) {
  return res.status(401).json({ success: false, message: 'Email not found' });
}

const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
  return res.status(401).json({ success: false, message: 'Incorrect password' });
}

if (!user.isAccountVerified) {
  return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
}


    if (!user.isAccountVerified)
      return res.json({ success: false, message: 'Please verify your email before logging in' });

    const token = createToken(user._id);

     res.cookie('token', token, {
      httpOnly: true,
      secure: true,        // must be true for cross-site HTTPS
      sameSite: 'none',    // allow cookies between pilate-1 and pilate-2
      // domain: '.onrender.com', // uncomment if you want it shared across subdomains
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    

    // don't use cookie, send token in JSON
    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', cookieOptions);
    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.json({ success: false, message: "User ID is required" });

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.isAccountVerified) return res.json({ success: false, message: "Account already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Failed to send OTP email" });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp)
    return res.json({ success: false, message: "Missing Details" });

  try {
    const user = await userModel.findById(userId);
    if (!user || user.verifyOtp !== otp || user.verifyOtpExpireAt < Date.now())
      return res.json({ success: false, message: 'Invalid or expired OTP' });

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer "))
      return res.json({ success: false, message: 'No token' });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) return res.json({ success: false, message: 'User not found' });

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendResertOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', email)
    });

    return res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    return res.json({ success: false, message: 'Failed to send OTP email' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: 'Missing required details' });

  try {
    const user = await userModel.findOne({ email });
    if (!user || user.resetOtp !== otp || user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResertOtp,
  resetPassword
};

