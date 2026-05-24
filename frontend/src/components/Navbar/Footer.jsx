import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = ({ isLoggedIn, userRole }) => {
  return (
    <footer className="footer-premium py-5">
      <div className="container">

        <div className="row align-items-start gy-5">

          {/* Logo + Tagline */}
          <div className="col-md-3 text-center text-md-start">
            <img src={logo} alt="logo" className="footer-logo mb-3 ms-md-0" />
          </div>

          {/* Explore */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Explore</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/templates/gallery">Gallery</Link></li>
              {isLoggedIn && <li><Link to="/template/subscriptions">Subscription</Link></li>}
              <li><Link to="/company">Company</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Account</h5>
            <ul className="list-unstyled footer-links">
              {!isLoggedIn ? (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Signup</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/review">Reviews</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Creator - Conditional */}
          {isLoggedIn && (userRole === "designer" || userRole === "developer") && (
            <div className="col-6 col-md-2">
              <h5 className="fw-bold mb-3">Creator</h5>
              <ul className="list-unstyled footer-links">
                <li><Link to="/templates/upload">Upload Template</Link></li>
                <li><Link to="/my/templates">My Templates</Link></li>
              </ul>
            </div>
          )}

          {/* Support */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center gap-3 mt-5 social-row">
          <a className="social-icon"><i className="bi bi-instagram"></i></a>
          <a className="social-icon"><i className="bi bi-twitter"></i></a>
          <a className="social-icon"><i className="bi bi-linkedin"></i></a>
        </div>

        <hr className="my-4 footer-divider" />

        {/* Bottom section */}
        <div className="d-flex justify-content-between flex-column flex-md-row text-center text-md-start small mt-3">
          <span>© {new Date().getFullYear()} PopDrop. All rights reserved.</span>

          <div className="d-flex gap-4 justify-content-center mt-2 mt-md-0 footer-bottom-links">
            <Link to="/company">About Us</Link>
            <Link to="/contact-us">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
