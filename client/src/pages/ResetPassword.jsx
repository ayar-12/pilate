import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppContext } from "../context/AppContext";import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
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
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
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
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
  
    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }
  
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
            style={{ width: '100%', padding: '10px', marginBottom: '10px' , borderRadius: '50px', backgroundColor: '#FFF2EB'}}
          />
          <button style={{borderRadius: '50px', background: '#8d1f58', color: '#FFF2EB', width: '200px', height: '40px'}} type="submit">Submit</button>
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
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
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
                    borderRadius: '4px',
                  }}
                />
              ))}
          </div>
          <button style={{borderRadius: '50px', background: '#8d1f58', color: '#FFF2EB', width: '200px', height: '40px', justifyContent: 'center', textAlign: 'center'}} type="submit">Verify OTP</button>
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
            style={{ width: '100%', padding: '10px', marginBottom: '10px' , borderRadius: '50px', backgroundColor: '#FFF2EB'}}
          />
          <button style={{borderRadius: '50px', background: '#8d1f58', color: '#FFF2EB', width: '200px', height: '40px', justifyContent: 'center', textAlign: 'center'}} type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;