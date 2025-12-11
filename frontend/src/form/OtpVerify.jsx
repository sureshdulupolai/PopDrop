import React, { useState, useEffect } from "react";
import { verifyOtp, resendOtp } from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpVerify.css";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safe extraction
  const user_id = location.state?.user_id;
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60);

  // Redirect if required data missing
  useEffect(() => {
    if (!user_id || !email) {
      navigate("/signup"); // redirect to signup if no state
    }
  }, [user_id, email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user_id || !email) return null; // blank while redirecting

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    if (!val && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const submitOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      await verifyOtp({ user_id, otp: finalOtp });
      setSuccess("OTP Verified! Redirecting...");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP, please try again.");
      setSuccess("");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ user_id });
      setTimer(60);
      setError("");
      setSuccess("OTP resent successfully!");
    } catch (err) {
      setError("Failed to resend OTP.");
      setSuccess("");
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-card">
        <p className="back-text" onClick={() => navigate(-1)}>
          ← Back
        </p>

        <h2 className="otp-title">Verify Your Email</h2>
        <p className="otp-subtext">
          We've sent a 6-digit code to <b>{email}</b>.
        </p>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <div className="otp-input-group">
          {otp.map((value, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength="1"
              className="otp-input"
              value={value}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={submitOtp}>
          Verify OTP
        </button>

        <p className="resend-text">
          Didn’t get the code?{" "}
          <button
            className="resend-link-btn"
            disabled={timer > 0}
            onClick={handleResend}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
