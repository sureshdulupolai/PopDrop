import React, { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Already logged-in user: direct profile
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const expiry = localStorage.getItem("expiry");
    const now = Date.now();

    // If access token expired but refresh exists, try to stay logged in
    if ((token && expiry && now < expiry) || refresh) {
      setIsLoggedIn(true);
      navigate("/profile", { replace: true });
    }
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;

      const now = Date.now();
      localStorage.setItem("access_token", token.access);
      localStorage.setItem("refresh_token", token.refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("expiry", now + 3 * 365 * 24 * 60 * 60 * 1000); // 3 years

      setIsLoggedIn(true);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper mt-4">
        <div className="left-panel">
          <h1 className="left-title">
            50+ curated <br />
            use cases that <span>boost conversions</span>
          </h1>

          <p className="left-desc">
            Start optimizing your website conversions with our tested,
            step-by-step strategies.
          </p>

          <button className="left-btn" onClick={() => navigate("/signup")}>
            Create Your Account
          </button>
        </div>

        <div className="right-panel">
          <div className="login-box">
            <div className="text-center mb-4">
              <img src={logo} width="65" className="mb-2 rounded-img" />
              <h3 className="fw-bold">PopDrop</h3>
              <p className="text-muted">Log in to your account</p>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              
              {/* EMAIL */}
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* PASSWORD WITH EYE ICON */}
              <div className="input-group mb-3">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="input-group-text"
                  onClick={() => setShowPass(!showPass)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              <div className="d-flex gap-3">

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>

              <p className="mt-3 text-end">
                <a href="#" className="forgot-link">Forgot password?</a>
              </p>
            </form>
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

.back-btn {
  width: 100%;
  border: 2px solid #f65b3b;
  padding: 12px;
  border-radius: 10px;
  background: transparent;
  font-weight: 600;
  color: #f65b3b;
}

.back-btn:hover {
  background: #ffe8e3;
}

.forgot-link {
  color: #e44;
  font-size: 14px;
}

.rounded-img {
  border-radius: 20px;
}

/* RESPONSIVE FIX */
@media (max-width: 992px) {

  .login-wrapper {
    flex-direction: column;
    height: auto;              /* ❗ FIX */
    overflow: visible;         /* ❗ FIX */
  }

  .left-panel {
    width: 100%;
    padding: 70px 24px 90px;   /* ⬅ more bottom space */
    text-align: left;
  }

  .right-panel {
    width: 100%;
    padding: 40px 20px 80px;
    align-items: flex-start;
  }

  .login-box {
    margin-top: 20px;          /* 🔥 image 3 fix */
  }
}

`}
      </style>
    </>
  );
};

export default Login;
