import { useEffect, useRef } from "react";
import "./Home.css";

export default function ReviewSlider() {
  const trackRef = useRef(null);
  let pos = 0;
  let speed = 0.5;
  let hover = false;

  useEffect(() => {
    const track = trackRef.current;

    // Duplicate content for infinite loop
    track.innerHTML += track.innerHTML;

    function move() {
      if (!hover) {
        pos -= speed;
        track.style.transform = `translateX(${pos}px)`;

        if (Math.abs(pos) >= track.scrollWidth / 2) {
          pos = 0;
        }
      }
      requestAnimationFrame(move);
    }

    move();

    // Hover pause
    track.addEventListener("mouseenter", () => (hover = true));
    track.addEventListener("mouseleave", () => (hover = false));
  }, []);

  return (
    <section className="pd-review-section">
      <div className="container">
        <div className="pd-review-header">
          <h2>
            400+ <span>★★★★★</span> ratings on Shopify
          </h2>
        </div>
      </div>

      {/* Slider Wrapper */}
      <div className="pd-review-slider">
        <div className="pd-review-track" ref={trackRef}>
          {/* CARD 1 */}
          <div className="pd-review-card">
            <h3>The Queen of Tarts</h3>
            <p className="pd-stars">★★★★★</p>
            <p>
              Great, easy-to-use app that helped my customers place their first
              important order. Fantastic support!
            </p>
          </div>

          {/* CARD 2 */}
          <div className="pd-review-card">
            <h3>Fuller's Flips</h3>
            <p className="pd-stars">★★★★★</p>
            <p>I started getting conversions from day one. Setup was instant and smooth.</p>
          </div>

          {/* CARD 3 */}
          <div className="pd-review-card">
            <h3>Topperswap</h3>
            <p className="pd-stars">★★★★★</p>
            <p>Clean design, user-friendly templates, and support responds instantly!</p>
          </div>

          {/* CARD 4 */}
          <div className="pd-review-card">
            <h3>Sunny’s Crafts</h3>
            <p className="pd-stars">★★★★★</p>
            <p>Boosted email signups and checkout conversions. Highly recommended!</p>
          </div>
        </div>
      </div>

      <div className="container text-center mt-4">
        <a className="pd-more-reviews" href="#">
          See more reviews →
        </a>
      </div>
    </section>
  );
}
