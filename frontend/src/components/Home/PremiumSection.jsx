import "./Home.css";
import { useNavigate } from "react-router-dom";

const PremiumSection = ({ isLoggedIn }) => {  // receive login state

  const navigate = useNavigate();
  if (isLoggedIn) return null;

  return (
    <section className="premium-section py-5">
      <div className="container">
        <div className="row g-5 align-items-center">

          {/* LEFT — Main Plan Card */}
          <div className="col-lg-5">
            <div className="premium-plan-card shadow-lg p-4">
              <h3 className="fw-bold mb-2 text-dark">Free plan available</h3>
              <span className="badge lifetime-badge mb-3">LIFETIME</span>
              <p className="text-muted mb-4">
                A simple way to get started with PopDrop.
              </p>
              <ul className="list-unstyled feature-list mb-4">
                <li><i className="bi bi-check-circle-fill"></i> 10,000 popup views / month</li>
                <li><i className="bi bi-check-circle-fill"></i> All features included</li>
                <li><i className="bi bi-check-circle-fill"></i> Unlimited campaigns</li>
                <li><i className="bi bi-check-circle-fill"></i> No credit card required</li>
              </ul>

              <button
                className="btn action-btn w-100 py-2 text-white"
                onClick={() => navigate("/signup")}
              >
                Create free account now
              </button>
            </div>
          </div>

          {/* RIGHT — Features */}
          <div className="col-lg-7">
            <div className="row g-4">

              {/* Feature Box */}
              <div className="col-md-6">
                <div className="premium-feature d-flex">
                  <div className="premium-icon">
                    <i className="bi bi-vector-pen"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">No-code editor</h5>
                    <p className="text-muted mb-0">Design branded popups without coding.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="premium-feature d-flex">
                  <div className="premium-icon">
                    <i className="bi bi-grid-3x3-gap"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">300+ templates</h5>
                    <p className="text-muted mb-0">Choose from modern responsive designs.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="premium-feature d-flex">
                  <div className="premium-icon">
                    <i className="bi bi-hand-thumbs-up"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Voted #1 support</h5>
                    <p className="text-muted mb-0">24/7 fast support with onboarding help.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="premium-feature d-flex">
                  <div className="premium-icon">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Hassle-free setup</h5>
                    <p className="text-muted mb-0">Add PopDrop to your site in 5 minutes.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
