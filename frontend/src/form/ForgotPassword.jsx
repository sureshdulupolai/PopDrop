import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { forgotPassword, resetPassword } from "../api/auth";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Redirecting
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // Countdown timer for automatic login redirect
  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (step === 3 && countdown === 0) {
      navigate("/login", { replace: true });
    }
  }, [step, countdown, navigate]);

  // STEP 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      if (res.data.status) {
        const generatedOtp = res.data.otp;

        // Send OTP using EmailJS
        await emailjs.send(
          "service_5bm58np",
          "template_1v2c0p9",
          {
            to_email: email,
            name: "PopDrop",
            time: new Date().toLocaleString(),
            message: `Your password reset OTP is: ${generatedOtp}`
          },
          "wtfODQiMYk4i24OWU"
        );

        setSuccess("OTP sent to your email successfully!");
        setTimeout(() => {
          setSuccess("");
          setStep(2);
        }, 1500);
      } else {
        setError(res.data.error || "Failed to generate OTP.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "User with this email does not exist."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await resetPassword({ email, otp, password });
      if (res.data.status) {
        setSuccess("Password changed successfully!");
        setStep(3);
      } else {
        setError(res.data.error || "Password reset failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "Invalid OTP, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper mt-4">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1 className="left-title">
            Reset your <br />
            password in <span>seconds</span>
          </h1>
          <p className="left-desc">
            Recover access to your account and keep sharing, discovering, and building templates.
          </p>
          <button className="left-btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="login-box">
            <div className="text-center mb-4">
              <img src={logo} width="65" className="mb-2 rounded-img" alt="PopDrop" />
              <h3 className="fw-bold">PopDrop</h3>
              <p className="text-muted">Recover your account password</p>
            </div>

            {/* Error alerts with premium styling */}
            {error && (
              <div 
                className="alert alert-danger d-flex align-items-center justify-content-between gap-2 border-0 mb-3" 
                style={{
                  background: "rgba(246, 91, 59, 0.08)",
                  borderLeft: "4px solid #f65b3b",
                  color: "#d43d1c",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14.5px",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(246, 91, 59, 0.06)",
                  textAlign: "left"
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill fs-5" style={{ color: "#f65b3b" }}></i>
                  <div>{error}</div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: "12px", filter: "invert(35%) sepia(95%) saturate(1859%) hue-rotate(345deg) brightness(88%) contrast(90%)" }}
                  aria-label="Close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {/* Success alerts with premium styling */}
            {success && (
              <div 
                className="alert alert-success d-flex align-items-center gap-2 border-0 mb-3" 
                style={{
                  background: "rgba(46, 204, 113, 0.08)",
                  borderLeft: "4px solid #2ecc71",
                  color: "#27ae60",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14.5px",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(46, 204, 113, 0.06)",
                  textAlign: "left"
                }}
              >
                <i className="bi bi-check-circle-fill fs-5" style={{ color: "#2ecc71" }}></i>
                <div>{success}</div>
              </div>
            )}

            {/* STEP 1: Enter email for OTP */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp}>
                <p className="small text-muted mb-3">
                  Please enter the email address linked to your account. We will send you a secure 6-digit OTP code to verify your identity.
                </p>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending OTP...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP & New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <p className="small text-muted mb-3">
                  A verification code has been dispatched to <b>{email}</b>.
                </p>

                {/* OTP INPUT */}
                <input
                  type="text"
                  maxLength="6"
                  className="form-control mb-3 text-center fw-bold fs-5"
                  placeholder="Enter 6-Digit OTP"
                  style={{ letterSpacing: "4px" }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                  required
                />

                {/* NEW PASSWORD */}
                <div className="input-group mb-3">
                  <input
                    type={showPass1 ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowPass1(!showPass1)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={`bi ${showPass1 ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="input-group mb-4">
                  <input
                    type={showPass2 ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowPass2(!showPass2)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={`bi ${showPass2 ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: Countdown Redirection Page */}
            {step === 3 && (
              <div className="text-center p-3">
                <div 
                  className="spinner-grow text-success mb-3" 
                  style={{ width: "3.5rem", height: "3.5rem" }} 
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="fw-bold text-success mb-2">Security Verification Complete</h4>
                <p className="text-muted small">
                  Your new credentials have been updated successfully.
                </p>
                <div 
                  className="alert alert-info border-0 py-2 d-flex align-items-center justify-content-center gap-2 mb-4"
                  style={{ background: "rgba(0, 180, 216, 0.08)", color: "#0077b6", borderRadius: "8px" }}
                >
                  <i className="bi bi-info-circle-fill"></i>
                  <span>Redirecting to Login Page in <b>{countdown}s</b>...</span>
                </div>
                <button className="login-btn" onClick={() => navigate("/login")}>
                  Go to Login Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
/* MAIN WRAPPER */
.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* LEFT SIDE */
.left-panel {
  width: 50%;
  padding: 80px 60px;
  background: linear-gradient(180deg, #fdf1ff, #ffe6e0, #fff6f0);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
}

.left-title span {
  background: linear-gradient(90deg, #bf4dff, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.left-desc {
  color: #555;
  max-width: 450px;
  margin-top: 15px;
}

.left-btn {
  margin-top: 35px;
  background: #f65b3b;
  color: #fff;
  padding: 13px 30px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  width: 230px;
  box-shadow: 0 6px 14px rgba(246,91,59,0.35);
  transition: 0.25s;
}

.left-btn:hover {
  background: #ff6b47;
}

/* RIGHT SIDE */
.right-panel {
  width: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* LOGIN BOX */
.login-box {
  width: 100%;
  max-width: 420px;
}

/* INPUT STYLE */
.form-control {
  padding: 12px 15px;
  border-radius: 10px;
  border: 1.8px solid #ddd;
  transition: 0.25s;
}

.form-control:focus {
  border-color: #f65b3b;
  box-shadow: 0 0 0 4px rgba(246,91,59,0.25);
}

/* BUTTONS */
.login-btn {
  background: #f65b3b;
  color: #fff;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0,0,0,0.18);
}

.login-btn:hover {
  background: #ff6b47;
}

.rounded-img {
  border-radius: 20px;
}

/* RESPONSIVE FIX */
@media (max-width: 992px) {
  .login-wrapper {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }

  .left-panel {
    width: 100%;
    padding: 70px 24px 90px;
    text-align: left;
  }

  .right-panel {
    width: 100%;
    padding: 40px 20px 80px;
    align-items: flex-start;
  }

  .login-box {
    margin-top: 20px;
  }
}
        `}
      </style>
    </>
  );
};

export default ForgotPassword;
