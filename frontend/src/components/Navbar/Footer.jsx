import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Home/Home.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer-premium py-5">
      <div className="container">

        <div className="row align-items-start gy-5">

          {/* Logo + Tagline */}
          <div className="col-md-3 text-center text-md-start">
            <img src={logo} alt="logo" className="footer-logo mb-3 ms-md-0" />
          </div>

          {/* Product */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Product</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Overview</a></li>
              <li><a href="#">Solutions</a></li>
              <li><a href="#">Campaigns</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Industries</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Solutions</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Automation</a></li>
              <li><a href="#">Segmentation</a></li>
              <li><a href="#">Insights</a></li>
              <li><a href="#">Completed Tasks</a></li>
              <li><a href="#">Performance</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Blog & Guides</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Help Desk</a></li>
              <li><a href="#">Live Chat</a></li>
              <li><a href="#">Report Issue</a></li>
              <li><a href="#">Knowledge Base</a></li>
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
          <span>© 2024 Store Name. All rights reserved.</span>

          <div className="d-flex gap-4 justify-content-center mt-2 mt-md-0 footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
