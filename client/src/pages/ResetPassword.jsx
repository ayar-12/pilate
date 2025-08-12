import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

function ResetPassword() {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRefs = useRef([]);

  // Modal alert state
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: null,
  });
  const openAlert = ({ title, message, confirmText = 'OK', onConfirm = null }) =>
    setAlert({ open: true, title, message, confirmText, onConfirm });
  const closeAlert = async () => {
    const cb = alert.onConfirm;
    setAlert((a) => ({ ...a, open: false }));
    if (typeof cb === 'function') await cb();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value.slice(-1);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        setIsEmailSent(true);
        openAlert({ title: 'OTP sent', message: 'We sent a 6-digit code to your email.' });
      } else {
        openAlert({ title: 'Error', message: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      openAlert({ title: 'Server error', message: error.message || 'Failed to send OTP.' });
    }
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value || '');
    const code = otpArray.join('');
    if (!/^\d{6}$/.test(code)) {
      openAlert({ title: 'Invalid code', message: 'Please enter the full 6-digit OTP.' });
      return;
    }
    setOtp(code);
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      openAlert({ title: 'Invalid code', message: 'Please enter the full 6-digit OTP.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      openAlert({ title: 'Weak password', message: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        openAlert({
          title: 'Password reset',
          message: data.message || 'Your password has been updated.',
          confirmText: 'Go to Login',
          onConfirm: () => navigate('/login'),
        });
      } else {
        openAlert({ title: 'Error', message: data.message || 'Could not reset password.' });
      }
    } catch (error) {
      openAlert({ title: 'Server error', message: error.message || 'Could not reset password.' });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail}>
          <h1>Reset Password</h1>
          <p>Enter your registered email address</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '50px', backgroundColor: '#FFF2EB' }}
          />
          <button
            style={{ borderRadius: '50px', background: '#8d1f58', color: '#FFF2EB', width: '200px', height: '40px' }}
            type="submit"
          >
            Submit
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmited && (
        <form onSubmit={onSubmitOTP}>
          <h1>Verify OTP</h1>
          <p>Enter the 6-digit OTP sent to your email</p>
          <div
            onPaste={handlePaste}
            style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}
          >
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: '40px',
                  height: '40px',
                  textAlign: 'center',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                }}
              />
            ))}
          </div>
          <button
            style={{
              borderRadius: '50px',
              background: '#8d1f58',
              color: '#FFF2EB',
              width: '200px',
              height: '40px',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            type="submit"
          >
            Verify OTP
          </button>
        </form>
      )}

      {isOtpSubmited && (
        <form onSubmit={onSubmitNewPassword}>
          <h1>New Password</h1>
          <p>Enter your new password</p>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '50px', backgroundColor: '#FFF2EB' }}
          />
          <button
            style={{
              borderRadius: '50px',
              background: '#8d1f58',
              color: '#FFF2EB',
              width: '200px',
              height: '40px',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            type="submit"
          >
            Reset Password
          </button>
        </form>
      )}

      {/* Centered alert dialog with blurred backdrop + 20px rounded paper */}
      <Dialog
        open={alert.open}
        onClose={closeAlert}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.25)',
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            p: 0,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#8d1f58' }}>
          {alert.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {alert.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} autoFocus>
            {alert.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ResetPassword;
