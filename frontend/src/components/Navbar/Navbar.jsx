import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid px-4">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="logo-wrapper">
            <img src={logo} alt="PopDrop" className="logo-img" />
          </div>
          <span className="fw-semibold brand-name">PopDrop</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#popdropNav"
          aria-controls="popdropNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="popdropNav">

          {/* Left Menu */}
          <ul className="navbar-nav left-menu gap-lg-4 align-items-lg-center">
            <li className="nav-item"><a className="nav-link" href="#">Product</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Templates</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Use Case Library</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Pricing</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Company</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Resources</a></li>
          </ul>

          {/* Right Buttons */}
          <div className="right-buttons d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {!isLoggedIn ? (
              <>
                <button className="btn" onClick={() => navigate("/login")}>Log in</button>
                <button className="btn get-btn px-4 py-2" onClick={() => navigate("/signup")}>Get PopDrop Free</button>
              </>
            ) : (
              <>
                <button className="btn login-btn" onClick={onLogout}>Logout</button>
                <button className="btn get-btn px-4 py-2" onClick={() => navigate("/dashboard")}>Dashboard</button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
