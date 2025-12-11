import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { signupUser } from "../api/auth"; // Your API function
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePass = (field) => {
    if (field === "password") setShowPass1(!showPass1);
    if (field === "confirmPassword") setShowPass2(!showPass2);
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullname: form.fullname,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      };

      const res = await signupUser(payload);
      const userData = res.data.data;

      setSuccess("Signup successful! Redirecting to OTP verification...");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            user_id: userData.user_id,
            email: userData.email,
          },
        });
      }, 1000);
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.data?.email) setError(err.response.data.email[0]);
      else if (err.response?.data?.non_field_errors) setError(err.response.data.non_field_errors[0]);
      else if (err.response?.data?.detail) setError(err.response.data.detail);
      else setError("Signup failed — email may already exist or input is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid full-height bg-white">
      <div className="row h-100">

        {/* LEFT FORM */}
        <div className="col-lg-6 left-section">
          <div className="signup-box">

            <div className="text-center mb-4">
              <img src={logo} width="65" className="mb-2 img-size" alt="PopDrop" />
              <h3 className="fw-bold">PopDrop</h3>
              <p className="text-muted">Create your account</p>
            </div>

            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

            <form onSubmit={submitSignup}>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="form-control mb-3"
                value={form.fullname}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="form-control mb-3"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                className="form-control mb-3"
                value={form.mobile}
                onChange={handleChange}
              />

              <div className="input-group mb-3">
                <input
                  type={showPass1 ? "text" : "password"}
                  name="password"
                  placeholder="Create Password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => togglePass("password")}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bi ${showPass1 ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              <div className="input-group mb-4">
                <input
                  type={showPass2 ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter Password"
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => togglePass("confirmPassword")}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bi ${showPass2 ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>
                <div className="col-6">
                  <button type="submit" className="signup-btn" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="col-lg-6 right-section">
          <div className="right-content">
            <h1 className="right-title">
              50+ curated <br />
              use cases that <span>boost conversions</span>
            </h1>

            <button
              className="right-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
