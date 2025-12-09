import "./Showcase.css";
import popup1 from "../../assets/popup1.png";

export default function Showcase() {
  return (
    <div className="showcase-wrapper">

      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-title">
          Popups, <span>supercharged</span>
        </h1>
        <p className="hero-subtext">
          Create high-performing popups in minutes. One platform, hundreds of use cases.
        </p>
      </section>

      {/* WHITE PREMIUM BOX */}
      <section className="showcase-box">
        <div className="inner">
          <div className="row g-5 align-items-center">

            {/* LEFT CONTENT */}
            <div className="col-lg-6">
              <p className="tagline">SMART DISCOUNT POPUP</p>
              <h2 className="showcase-title">
                Achieve 15–20% opt-in <br /> rates with smarter popups
              </h2>
              <p className="showcase-desc">
                Maximize email and SMS list growth with an advanced popup formula
                designed to maximize both list growth & sales.
              </p>
              <a href="#" className="learn-more">See how it works →</a>
            </div>

            {/* RIGHT IMAGE STACK */}
            <div className="col-lg-6 position-relative popup-flow">
              <img src={popup1} className="popup-img img-left" />
              {/* <div className="arrow-line"></div> */}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
