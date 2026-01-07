import grpPhoto from "../../assets/grp_photo.jpg";

export function HeroSectionCompany() {
    return (
        <section className="cp-hero-section d-flex align-items-center text-white">
            <img
            src={grpPhoto}
            alt="Hero Background"
            className="cp-hero-bg"
            />
            <div className="cp-hero-overlay"></div>
            <div className="container text-center position-relative mt-5">
                <h1 className="fw-bold display-5 cp-hero-title">
                    Our mission is to <br /> turn everyone into a master online seller
                </h1>
                <p className="text-light cp-hero-subtitle">
                    Our goal is to help small businesses with simple, effective tools for
                    increasing their online revenue.
                </p>
            </div>
        </section>
    );
}