import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { signupUser } from "../api/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Signup.css";

const ROLE_TEXT = {
  normal: {
    title: "Create your account",
    subtitle: "You are signing up as a normal user",
    rightTitle: "Explore curated templates",
    rightDesc: "Browse and use ready-made use cases"
  },
  designer: {
    title: "Designer Signup",
    subtitle: "You are signing up as a designer",
    rightTitle: "Showcase your creativity",
    rightDesc: "Upload designs and collaborate"
  },
  developer: {
    title: "Developer Signup",
    subtitle: "You are signing up as a developer",
    rightTitle: "Developer Access",
    rightDesc: "Get admin & advanced platform access"
  }
};

const Signup = ({ role }) => {
  const navigate = useNavigate();

  // ❌ Safety check
  if (!ROLE_TEXT[role]) {
    return (
      <div className="text-center mt-5">
        <h2>Invalid Signup URL</h2>
        <p>Please use a valid signup link.</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitSignup = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error
    setLoading(true); // start loading

    // Frontend password mismatch check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const payload = {
      fullname: form.fullname,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
      category: role
    };

    try {
      const res = await signupUser(payload);

      // Check backend response
      if (res.data.status) {
        // Success → navigate to OTP page
        navigate("/verify-otp", {
          state: {
            user_id: res.data.data.user_id,
            email: res.data.data.email
          }
        });
      } else {
        // Backend returned validation errors
        // Flatten the first error message from serializer
        const backendError = res.data.errors
          ? Object.values(res.data.errors).flat()[0]
          : res.data.message || "Signup failed";

        setError(backendError);
      }
    } catch (err) {
      // Network or server error
      const networkError =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()[0]
          : err.response?.data?.message || "Signup failed";
      setError(networkError);
    } finally {
      setLoading(false); // stop loading
    }
  };


  const content = ROLE_TEXT[role];

  return (
    <>
    <div className="container-fluid full-height bg-white mt-4">
      <div className="row h-100">

        {/* LEFT */}
        <div className="col-lg-6 left-section">
          <div className="signup-box">

            <div className="text-center mb-4">
              <img src={logo} width="65" alt="PopDrop" />
              <h3 className="fw-bold mt-2">{content.title}</h3>
              <p className="text-muted">{content.subtitle}</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}
            
            <form onSubmit={submitSignup}>
              <input
                className="form-control mb-3"
                name="fullname"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-3"
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-3"
                name="mobile"
                placeholder="Mobile"
                onChange={handleChange}
              />

              <div className="input-group mb-3">
                <input
                  type={showPass1 ? "text" : "password"}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPass1(!showPass1)}
                >
                  <i className={`bi ${showPass1 ? "bi-eye-slash" : "bi-eye"}`} />
                </span>
              </div>

              <div className="input-group mb-4">
                <input
                  type={showPass2 ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPass2(!showPass2)}
                >
                  <i className={`bi ${showPass2 ? "bi-eye-slash" : "bi-eye"}`} />
                </span>
              </div>

              <button className="signup-btn w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing up...
                  </>
                ) : (
                  `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-6 right-section">
          <div className="right-content">
            <h1 className="right-title">{content.rightTitle}</h1>
            <p>{content.rightDesc}</p>

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

    </>
  );
};

export default Signup;
