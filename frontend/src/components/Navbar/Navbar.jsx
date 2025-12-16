import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

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
            <li className="nav-item"><a className="nav-link" href="#">Templates</a></li>
            <li className="nav-item"><Link className="nav-link" to="/review">Review</Link></li>
            <li className="nav-item"><a className="nav-link" href="#">Company</a></li>
          </ul>

          {/* Right Actions */}
          <div className="right-buttons d-flex align-items-center gap-3 mt-3 mt-lg-0">

            {!isLoggedIn ? (
              <>
                <button
                  className="btn"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>

                <button
                  className="btn get-btn px-4 py-2"
                  onClick={() => navigate("/signup")}
                >
                  Get PopDrop Free
                </button>
              </>
            ) : (
              <>
                {/* Profile Icon */}
                <button
                  className="btn profile-icon-btn"
                  onClick={() => navigate("/profile")} // Profile page ka path
                  title="Profile"
                >
                  <i className="bi bi-person-circle fs-5 fw-bold"></i>
                </button>

                {/* Logout Icon */}
                <button
                  className="btn logout-icon-btn"
                  onClick={onLogout}
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right fs-5 fw-bold"></i>
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>

    <style>
      {`
.dashboard-icon-btn,
.profile-icon-btn,
.logout-icon-btn {
  background: transparent;
  color: #1e293b; /* dark gray */
  border-radius: 8px;
  padding: 6px 10px;
  transition: all 0.2s ease;
}

.dashboard-icon-btn:hover,
.profile-icon-btn:hover {
  background: #e0e7ff; /* soft blue hover */
  color: #4338ca;
}

.logout-icon-btn:hover {
  background: #fee2e2; /* soft red hover */
  color: #b91c1c;
}


      `}
    </style>
    </>
  );
}
