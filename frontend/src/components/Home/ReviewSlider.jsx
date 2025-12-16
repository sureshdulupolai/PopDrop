import { useEffect, useRef, useState } from "react";
import { getReviews } from "../../api/reviews";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function ReviewSlider() {
  const trackRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  let pos = 0;
  let speed = 0.5;
  let hover = false;

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await getReviews();
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    }

    fetchReviews();
  }, []);

  /* ================= SLIDER LOGIC ================= */
  useEffect(() => {
    if (!reviews.length) return;

    const track = trackRef.current;
    if (!track) return;

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

    track.addEventListener("mouseenter", () => (hover = true));
    track.addEventListener("mouseleave", () => (hover = false));
  }, [reviews]);

  /* ================= STAR RENDER ================= */
  const renderStars = (count) => {
    return "★★★★★☆☆☆☆☆".slice(5 - count, 10 - count);
  };

  /* ================= NO REVIEWS → HIDE ================= */
  if (reviews.length === 0) return null;

  return (
    <section className="pd-review-section">
      <div className="container">
        <div className="pd-review-header">
          <h2>
            {reviews.length}+ <span>★★★★★</span> ratings on Shopify
          </h2>
        </div>
      </div>

      {/* SLIDER */}
      <div className="pd-review-slider">
        <div className="pd-review-track" ref={trackRef}>
          {reviews.map((review) => (
            <div className="pd-review-card" key={review.id}>
              <h3>{review.user_name}</h3>
              <p className="pd-stars">{renderStars(review.rating)}</p>
              <p>{review.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEE MORE (only if > 6 reviews) */}
      {reviews.length > 6 && (
        <div className="container text-center mt-4">
          <button
            className="pd-more-reviews"
            onClick={() => navigate("/reviews")}
          >
            See more reviews →
          </button>
        </div>
      )}
    </section>
  );
}
