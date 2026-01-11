import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

export default function Navbar({ isLoggedIn, onLogout, userRole }) {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  // console.log(userRole);
  return (
    <>
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="popdropNav">

            {/* Left Menu */}
            <ul className="navbar-nav left-menu gap-lg-4 align-items-lg-center">

              {/* Templates Dropdown */}
              <li
                className={`nav-item custom-dropdown ${showTemplates ? "open" : ""}`}
                onMouseEnter={() => setShowTemplates(true)}
                onMouseLeave={() => setShowTemplates(false)}
              >
                <button
                  className="nav-link dropdown-btn"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  Templates <i className="bi bi-chevron-down ms-1"></i>
                </button>

                <div className="custom-dropdown-menu">
                  <Link to="/templates/gallery" className="dropdown-item">
                    <i className="bi bi-code-slash"></i>
                    <div className="content-div">
                      <strong>Gallery</strong>
                      <span className="ms-2">Developer ready templates</span>
                    </div>
                  </Link>

                  {isLoggedIn && (userRole === "designer" || userRole === "developer") && (
                    <Link to="/templates/upload" className="dropdown-item">
                      <i className="bi bi-cloud-upload"></i>
                      <div className="content-div">
                        <strong>Upload</strong>
                        <span className="ms-2">Upload & customize instantly</span>
                      </div>
                    </Link>
                  )}

                  <Link to="/template/subscriptions" className="dropdown-item">
                    <i className="bi bi-credit-card"></i>
                    <div className="content-div">
                      <strong>Subscription</strong>
                      <span className="ms-2">Subscriber content</span>
                    </div>
                  </Link>

                  {isLoggedIn && (userRole === "designer" || userRole === "developer") && (
                    <Link to="/my/templates" className="dropdown-item">
                      <i className="bi bi-person-circle"></i>
                      <div className="content-div">
                        <strong>My Profile</strong>
                        <span className="ms-2">View & manage your account</span>
                      </div>
                    </Link>
                  )}
                </div>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/company">Company</Link>
              </li>

              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/review">Review</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/contact-us">Contact</Link>
                  </li>
                </>
              )}
            </ul>

            {/* Right Actions */}
            <div className="right-buttons d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {!isLoggedIn ? (
                <>
                  <button className="btn" onClick={() => navigate("/login")}>
                    Log in
                  </button>
                  <button className="btn get-btn" onClick={() => navigate("/signup")}>
                    Get PopDrop Free
                  </button>
                </>
              ) : (
                <>
                  <button className="btn profile-icon-btn" onClick={() => navigate("/profile")}>
                    <i className="bi bi-person-circle fs-5"></i>
                  </button>
                  <button className="btn logout-icon-btn" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right fs-5"></i>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      <style>
        {`
/* ===== Templates Dropdown ===== */
.custom-dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #555;
  font-size: 15px;
  cursor: pointer;
}

.custom-dropdown-menu {
  position: absolute;
  top: 140%;
  left: 0;
  width: 300px;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.25s ease;
  z-index: 9999;
}

/* Open state */
.custom-dropdown.open .custom-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Items */
.custom-dropdown-menu .dropdown-item {
  display: flex;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  transition: 0.2s;
}

.custom-dropdown-menu .dropdown-item i {
  font-size: 22px;
  color: #f65b3b;
}

.custom-dropdown-menu .dropdown-item strong {
  font-size: 14px;
}

.custom-dropdown-menu .dropdown-item span {
  font-size: 12px;
  color: #6b7280;
}

.custom-dropdown-menu .dropdown-item:hover {
  background: #f8fafc;
  // transform: translateX(4px);
}
.content-div{
position: relative;
top: 3px;
}
        `}
      </style>
    </>
  );
}
