import "./Home.css";
import whiteHome from "../../assets/white_home.png";

export default function Showcase() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="hero-wrapper">
        <section className="hero-section">
          <h1 className="hero-title">
            drag-drop, <span>supercharged</span>
          </h1>

          <p className="hero-subtext">
            A modern, open-source popup library with beautifully crafted templates.
            Copy, paste, and customize popups for any website instantly.
          </p>
        </section>
      </div>

      {/* ================= WHITE PAGE SECTION ================= */}
      <div className="page-white-bg">
        <div className="showcase-wrapper">
          <section className="showcase-box">
            <div className="inner">
              <div className="row g-5 align-items-center">

                {/* LEFT CONTENT */}
                <div className="col-lg-6">
                  <p className="tagline">PREMIUM POPUP TEMPLATE</p>

                  <h2 className="showcase-title">
                    Create stunning popups <br />
                    without writing everything from scratch
                  </h2>

                  <p className="showcase-desc">
                    PopDrop offers a curated library of clean, responsive popup layouts.
                    Choose a style, copy the code in HTML, Bootstrap or React, and
                    customize it freely — all open-source and free forever.
                  </p>

                  <a href="#" className="learn-more">
                    Browse all templates →
                  </a>
                </div>

                {/* RIGHT IMAGE */}
                <div className="col-lg-6 popup-flow">
                  <img
                    src={whiteHome}
                    alt="Popup preview"
                    className="popup-img img-right-adjust"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
