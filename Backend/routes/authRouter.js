const express = require('express');
const { register, logout, login, sendVerifyOtp, verifyEmail, isAuthenticated, sendResertOtp, resetPassword } = require('../controller/authController');
const { userAuth } = require('../middleware/userAuth');
const rateLimit = require('express-rate-limit');

const loginlimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, Please try again later.'
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: 'Too many OTP requests, please wait a while.',
});

const router = express.Router();

router.post('/register', register);
router.post('/login', loginlimiter, login);
router.post('/logout', logout);
router.post('/send-verify-otp', userAuth, otpLimiter, sendVerifyOtp);
router.post('/send-reset-otp', otpLimiter, sendResertOtp);
router.post('/verify-account', userAuth, verifyEmail);
router.get('/is-auth', userAuth, isAuthenticated);
router.post('/reset-password', resetPassword);

module.exports = router;
