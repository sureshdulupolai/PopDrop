import "./Home.css";
import whiteHome from "../../assets/white_home.png"; // <-- updated image path

export default function Showcase() {
  return (
    <>
      {/* HERO SECTION WRAPPER */}
      <div className="hero-wrapper">
        <section className="hero-section text-center">

          <h1 className="hero-title">
            darg-drop, <span>supercharged</span>
          </h1>

          <p className="hero-subtext mt-3">
            A modern, open-source popup library with beautifully crafted templates.
            Copy, paste, and customize popups for any website instantly.
          </p>

        </section>
      </div>

      {/* WHITE PREMIUM BOX WRAPPER */}
      <div className="showcase-wrapper">
        <section className="showcase-box">

          <div className="half-white-bg"></div>

          <div className="inner mb-4">
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

                <a href="#" className="learn-more">Browse all templates →</a>
              </div>

              {/* RIGHT IMAGE */}
              <div className="col-lg-6 position-relative popup-flow">
                <img src={whiteHome} className="popup-img img-left" alt="Popup" />
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
