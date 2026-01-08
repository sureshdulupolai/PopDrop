import grpPhoto from "../../assets/grp_photo.jpg";

export function CompanyStory() {
  return (
    <section className="cp-story-section bg-white">
      <div className="container">
        <h2 className="fw-bold text-center mb-5">Our story</h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={grpPhoto}
              alt="Our team"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-md-6">
            <h5 className="fw-semibold">Growing together with our users</h5>
            <p className="text-muted mt-3">
              We started with a simple idea: help businesses convert more
              visitors without hurting user experience. Over time, this idea
              grew into a full platform trusted worldwide.
            </p>
            <p className="text-muted">
              Today, thousands of businesses rely on our tools to grow faster
              and smarter.
            </p>
          </div>
        </div>

        <div className="cp-timeline mt-5">
          <div className="cp-timeline-item">
            <span className="cp-year">2014</span>
            <p>Version 1.0 – Simple popup tool</p>
          </div>
          <div className="cp-timeline-item">
            <span className="cp-year">2018</span>
            <p>Version 2.0 – Ecommerce toolkit</p>
          </div>
          <div className="cp-timeline-item">
            <span className="cp-year">2022</span>
            <p>Version 3.0 – Full personalization platform</p>
          </div>
        </div>
      </div>
    </section>
  );
}