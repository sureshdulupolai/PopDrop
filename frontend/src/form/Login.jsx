import React, { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
// import "./Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already logged in
    const token = localStorage.getItem("access_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;

      // Store tokens for permanent login
      localStorage.setItem("access_token", token.access);
      localStorage.setItem("refresh_token", token.refresh);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid full-height">
      <div className="row w-100">
        {/* LEFT SIDE */}
        <div className="col-lg-6 left-section">
          <h1 className="left-title">
            50+ curated <br />
            use cases that <span>boost conversions</span>
          </h1>
          <p className="mt-3 text-secondary" style={{ maxWidth: 450 }}>
            Start optimizing your website conversions with our tested, step-by-step strategies.
          </p>
          <button className="left-btn" onClick={() => navigate("/signup")}>
            Create Your Account
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="login-box">
            <div className="text-center mb-4">
              <img src={logo} width="65" className="mb-2 img-size" />
              <h3 className="fw-bold">PopDrop</h3>
              <p className="text-muted">Log in to your account</p>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control mb-4"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="d-flex gap-3">
                <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>

              <div className="mt-3 text-end">
                <a href="#" className="text-danger" style={{ fontSize: 14 }}>
                  Forgot password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
