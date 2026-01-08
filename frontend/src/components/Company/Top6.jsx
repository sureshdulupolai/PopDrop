import grpPhoto from "../../assets/grp_photo.jpg";

export function LifeAtCompany() {
  return (
    <section className="life-section">
      <div className="container">
          <div className="text-center mb-5">
          <h2 className="life-title">Life at Our Company</h2>
          <p className="life-subtitle">
              Across offices and cultures, growing together.
          </p>
          </div>

          <div className="life-grid">
          <img src={grpPhoto} alt="Life 1" />
          <img src={grpPhoto} alt="Life 2" />
          <img src={grpPhoto} alt="Life 3" />
          <img src={grpPhoto} alt="Life 4" />
          <img src={grpPhoto} alt="Life 5" />
          <img src={grpPhoto} alt="Life 6" />
          <img src={grpPhoto} alt="Life 7" />
          </div>
      </div>
    </section>
  );
}
