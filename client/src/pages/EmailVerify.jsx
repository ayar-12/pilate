import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const { backendUrl, getUserData } = useContext(AppContext);
  const inputRef = useRef([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // alert modal state
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

  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      openAlert({
        title: 'Missing info',
        message: 'User ID not found. Please register again.',
        confirmText: 'Go to Register',
        onConfirm: () => navigate('/register'),
      });
    }
  }, [userId, navigate]);

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value.slice(-1); // only last digit
    if (value && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    paste.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
        if (index < inputRef.current.length - 1) {
          inputRef.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otp = inputRef.current.map((input) => input.value).join('');

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      openAlert({ title: 'Invalid code', message: 'Please enter a valid 6-digit OTP.' });
      return;
    }

    setSubmitLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { userId, otp });
      if (data.success) {
        openAlert({
          title: 'Verified',
          message: data.message || 'Your email has been verified.',
          confirmText: 'Continue',
          onConfirm: async () => {
            await getUserData?.();
            navigate('/');
          },
        });
      } else {
        inputRef.current.forEach((input) => {
          if (input) input.style.border = '1px solid red';
        });
        openAlert({ title: 'Verification failed', message: data.message || 'Please try again.' });
      }
    } catch (error) {
      openAlert({ title: 'Server error', message: error?.message || 'Verification failed.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { userId });
      if (data.success) {
        openAlert({ title: 'OTP sent', message: 'A new OTP has been sent to your email.' });
      } else {
        openAlert({ title: 'Failed', message: data.message || 'Could not resend OTP.' });
      }
    } catch {
      openAlert({ title: 'Server error', message: 'Error while resending OTP.' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="#8d1f58">
          Email Verification
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
          Enter the 6-digit code sent to your email
        </Typography>

        <form onSubmit={onSubmitHandler}>
          <Box
            onPaste={handlePaste}
            sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}
          >
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                ref={(el) => (inputRef.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: '40px',
                  height: '40px',
                  textAlign: 'center',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitLoading}
            sx={{
              borderRadius: 99,
              px: 4,
              backgroundColor: '#8d1f58',
              '&:hover': { backgroundColor: '#6e2345' },
            }}
          >
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Verify Email"}
          </Button>
        </form>

        <Box mt={3}>
          <Button
            type="button"
            onClick={resendOtp}
            disabled={resendLoading}
            variant="text"
            sx={{ textDecoration: 'underline', color: '#8d1f58' }}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </Button>
        </Box>
      </Paper>

      {/* Centered Alert Dialog with blurred backdrop + 20px rounded paper */}
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
            {alert.confirmText || 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailVerify;
