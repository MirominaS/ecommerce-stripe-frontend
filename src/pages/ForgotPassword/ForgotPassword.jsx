import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "../../services/authService";
import "./forgotPassword.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOTP = async () => {
    try {
      await forgotPassword(email);
      alert("OTP sent successfully");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(email, otp);
      alert("OTP verified");
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleResendOTP = async () => {
    try {
      await forgotPassword(email);

      alert("New OTP sent successfully")
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resend OTP")
    }
  }
  const handleResetPassword = async () => {
    try {
      await resetPassword(email, otp, newPassword);
      alert("Password reset successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };
  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Reset Password</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOTP}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOTP}>Verify OTP</button>
            <button onClick={handleResendOTP}>Resend OTP</button>
            
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
