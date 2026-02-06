import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

export default function Navbar({ isLoggedIn, onLogout, userRole }) {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);

  // 📱 Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileTemplatesOpen, setIsMobileTemplatesOpen] = useState(false);

  // 🔒 Lock Body Scroll when Sidebar is Open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setIsMobileTemplatesOpen(false); // Reset accordion
  };

  const handleMobileLinkClick = (path) => {
    navigate(path);
    closeSidebar();
  };

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

          {/* 🍔 Mobile Hamburger (Custom Click) */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 🖥️ Desktop Menu (Hidden on Mobile) */}
          <div className="collapse navbar-collapse d-none d-lg-block" id="popdropNav">

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

      {/* 📱 Mobile Sidebar Overlay */}
      <div
        className={`mobile-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* 📱 Mobile Sidebar Drawer */}
      <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>

        {/* Header */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="PopDrop" width="32" />
            <span className="fw-bold fs-5">PopDrop</span>
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="sidebar-content">

          <ul className="sidebar-menu">

            {/* Templates Accordion */}
            <li className="sidebar-item">
              <div
                className="sidebar-link d-flex justify-content-between align-items-center"
                onClick={() => setIsMobileTemplatesOpen(!isMobileTemplatesOpen)}
              >
                <span>Templates</span>
                <i className={`bi bi-chevron-down transition-icon ${isMobileTemplatesOpen ? "rotate-180" : ""}`}></i>
              </div>

              {/* Accordion Body */}
              <div className={`mobile-accordion ${isMobileTemplatesOpen ? "expanded" : ""}`}>
                <div onClick={() => handleMobileLinkClick("/templates/gallery")} className="sub-item">
                  <i className="bi bi-code-slash me-2"></i> Gallery
                </div>

                {isLoggedIn && (userRole === "designer" || userRole === "developer") && (
                  <div onClick={() => handleMobileLinkClick("/templates/upload")} className="sub-item">
                    <i className="bi bi-cloud-upload me-2"></i> Upload
                  </div>
                )}

                <div onClick={() => handleMobileLinkClick("/template/subscriptions")} className="sub-item">
                  <i className="bi bi-credit-card me-2"></i> Subscription
                </div>

                {isLoggedIn && (userRole === "designer" || userRole === "developer") && (
                  <div onClick={() => handleMobileLinkClick("/my/templates")} className="sub-item">
                    <i className="bi bi-person-circle me-2"></i> My Profile
                  </div>
                )}
              </div>
            </li>

            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => handleMobileLinkClick("/company")}>
                Company
              </div>
            </li>

            {isLoggedIn && (
              <>
                <li className="sidebar-item">
                  <div className="sidebar-link" onClick={() => handleMobileLinkClick("/review")}>
                    Review
                  </div>
                </li>
                <li className="sidebar-item">
                  <div className="sidebar-link" onClick={() => handleMobileLinkClick("/contact-us")}>
                    Contact
                  </div>
                </li>
              </>
            )}
          </ul>

        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {!isLoggedIn ? (
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-dark w-100" onClick={() => handleMobileLinkClick("/login")}>
                Log in
              </button>
              <button className="btn get-btn w-100" onClick={() => handleMobileLinkClick("/signup")}>
                Get PopDrop Free
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn d-flex align-items-center gap-2" onClick={() => handleMobileLinkClick("/profile")}>
                <i className="bi bi-person-circle fs-4"></i>
                <span>My Profile</span>
              </button>
              <button className="btn text-danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right fs-4"></i>
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
