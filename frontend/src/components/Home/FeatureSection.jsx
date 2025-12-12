import "./Home.css";

// Import images from assets
import imgAnalytics from "../../assets/a-analytics.png";
import imgTriggers from "../../assets/a-triggers.png";
import imgDiscount from "../../assets/a-discount.png";
import imgCart from "../../assets/a-cart.png";

const FeatureSection = () => {
  return (
    <section className="feature-section py-5 bg-white">
      <div className="container">
        
        <h2 className="section-title text-center mb-5">
          Built to grow your sales, not just your email list
        </h2>

        <div className="row g-4">

          {/* CARD 1 */}
          <div className="col-md-6 col-lg-3">
            <div className="feature-card equal-card gradient-card">
              <h4>Popup Analytics</h4>
              <p>Track impressions, clicks & conversion insights for every popup.</p>

              <div className="feature-img-wide mt-3">
                <img src={imgAnalytics} alt="analytics popup" />
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-md-6 col-lg-3">
            <div className="feature-card equal-card white-card">
              <h4>Behavior Triggers</h4>
              <p>Activate popups using scroll depth, exit intent or inactivity.</p>

              <div className="feature-img-wide mt-5">
                <img src={imgTriggers} alt="behavior triggers" />
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-md-6 col-lg-3">
            <div className="feature-card equal-card white-card">
              <h4>Smart Discounts</h4>
              <p>Auto-apply coupons when users interact with your popups.</p>

              <div className="feature-img-wide mt-3">
                <img src={imgDiscount} alt="smart discounts" />
              </div>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="col-md-6 col-lg-3">
            <div className="feature-card equal-card gradient-card">
              <h4>Cart Value Targeting</h4>
              <p>Trigger upsell or free-shipping popups based on cart value.</p>

              <div className="feature-img-wide mt-3">
                <img src={imgCart} alt="cart value" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeatureSection;
