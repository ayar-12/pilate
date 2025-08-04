import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);
  const inputRef = useRef([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRef.current.length - 1) {
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
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
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
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setSubmitLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, {
        userId: userData._id,
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
        inputRef.current.forEach(input => {
          input.style.border = '1px solid red';
        });
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
        userId: userData._id,
      });

      if (data.success) {
        toast.success("OTP resent to your email.");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Server error while resending OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    // Clear OTP boxes on load or user change
    inputRef.current.forEach(input => {
      if (input) input.value = "";
    });

    // Redirect if already verified
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

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
                  borderRadius: '4px',
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
    </Box>
  );
};

export default EmailVerify;

