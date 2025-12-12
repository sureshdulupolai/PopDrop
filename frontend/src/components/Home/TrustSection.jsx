import "./Home.css";

// IMPORT ALL IMAGES FROM ASSETS
import illustration from "../../assets/your-illustration.png";
import badge1 from "../../assets/badge1.png";
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";

export default function TrustSection() {
  return (
    <section className="trust-section py-5 bg-white">
      <div className="container">

        <div className="row align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-lg-4 text-center mb-4 mb-lg-0">
            <img
              src={illustration}
              className="img-fluid trust-illustration"
              alt="PopDrop Illustration"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-lg-8 text-center text-lg-start">

            <h2 className="trust-title">
              You’re in a <span className="gradient-text">great company</span>
            </h2>

            <p className="trust-subtext">
              PopDrop is trusted by developers, creators and startups for building
              modern popups — free and open-source.
            </p>

            {/* BADGES */}
            <div className="badge-row d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4">
              <img src={badge1} className="trust-badge" alt="badge" />
              <img src={badge1} className="trust-badge" alt="badge" />
              <img src={badge1} className="trust-badge" alt="badge" />
              <img src={badge1} className="trust-badge" alt="badge" />
              <img src={badge1} className="trust-badge" alt="badge" />
            </div>

          </div>
        </div>

        {/* BRAND LOGO SLIDER */}
        <div className="brand-strip mt-5">
          <p className="trusted-text text-center fw-bold">
            Trusted by 10,000+ developers worldwide
          </p>

          <div className="logo-slider">
            <div className="logo-track">

              <img src={logo1} className="brand-logo" alt="brand logo" />
              <img src={logo2} className="brand-logo" alt="brand logo" />
              <img src={logo1} className="brand-logo" alt="brand logo" />
              <img src={logo2} className="brand-logo" alt="brand logo" />
              <img src={logo1} className="brand-logo" alt="brand logo" />
              <img src={logo2} className="brand-logo" alt="brand logo" />
              <img src={logo1} className="brand-logo" alt="brand logo" />

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
