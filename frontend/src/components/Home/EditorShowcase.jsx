import "./Home.css";
import homeBuild from "../../assets/home_build.png"; // Updated image path

export default function EditorShowcase() {
  return (
    <section className="editor-showcase py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-6 mb-lg-0">

            <h2 className="editor-title">
              Build stunning popups instantly with our no-code editor
            </h2>

            <div className="feature-list">

              <div className="feature-item">
                <span className="icon-box purple">
                  <i className="bi bi-magic"></i>
                </span>
                <div>
                  <h5>Drag & Drop Builder</h5>
                  <p>Create beautiful popups without any coding.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="icon-box pink">
                  <i className="bi bi-layers"></i>
                </span>
                <div>
                  <h5>Reusable Styles</h5>
                  <p>Save your designs and apply them anywhere.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="icon-box orange">
                  <i className="bi bi-eye"></i>
                </span>
                <div>
                  <h5>Live Preview</h5>
                  <p>See exactly how your popup will look on your site.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="icon-box purple">
                  <i className="bi bi-palette"></i>
                </span>
                <div>
                  <h5>Smart Themes</h5>
                  <p>Choose and reuse templates for multiple use-cases.</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="col-lg-6 text-center">
            <div className="editor-mockup ms-4">
              <img
                src={homeBuild}
                alt="No-code editor mockup"
                className="editor-video"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
