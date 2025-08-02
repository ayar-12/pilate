import React, { useContext, useEffect, useRef, useState } from 'react';
import { Input } from '@mui/material';
import axios from 'axios';
import { AppContext } from "../context/AppContext";import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function EmailVerify() {
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false)
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);
  const inputRef = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
        userId: userData._id,
      });

      if (data.success) {
        toast.success("OTP sent again to your email.");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Server error while resending OTP.");
    } finally {
      setResendLoading(false);
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
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) navigate('/');
  }, [isLoggedin, userData, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <form onSubmit={onSubmitHandler}>
        <h1>Email Verification</h1>
        <p>Enter the 6-digit code sent to your email</p>

        {/* OTP Inputs */}
        <div onPaste={handlePaste} style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
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
        </div>

        <button type="submit">Verify Email</button>

        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailVerify;
