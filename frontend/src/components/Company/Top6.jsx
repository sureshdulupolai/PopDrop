import img_1 from "../../assets/company/img_1.jpg";
import img_2 from "../../assets/company/img_2.jpg";
import img_3 from "../../assets/company/img_3.jpg";
import img_4 from "../../assets/company/img_4.jpg";
import img_5 from "../../assets/company/img_5.jpg";
import img_6 from "../../assets/company/img_6.jpeg";
import img_7 from "../../assets/company/img_7.jpg";

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
          <img src={img_1} alt="Life 1" />
          <img src={img_2} alt="Life 2" />
          <img src={img_3} alt="Life 3" />
          <img src={img_4} alt="Life 4" />
          <img src={img_5} alt="Life 5" />
          <img src={img_6} alt="Life 6" />
          <img src={img_7} alt="Life 7" />
          </div>
      </div>
    </section>
  );
}
