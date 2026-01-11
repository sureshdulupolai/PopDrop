import { useEffect, useRef, useState } from "react";
import { getReviews } from "../../api/reviews";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function ReviewSlider({ isLoggedIn }) {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const posRef = useRef(0);
  const hoverRef = useRef(false);

  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const speed = 0.5;

  /* ================= STOP IF NOT LOGGED IN ================= */
  useEffect(() => {
    if (!isLoggedIn) return;

    let mounted = true;

    async function fetchReviews() {
      try {
        const res = await getReviews();
        if (mounted) {
          setReviews(res.data || []);
        }
      } catch (err) {
        // ❌ NO REDIRECT
        console.warn("Reviews hidden (not logged in)");
      }
    }

    fetchReviews();
    return () => (mounted = false);
  }, [isLoggedIn]);

  /* ================= SLIDER ANIMATION ================= */
  useEffect(() => {
    if (!isLoggedIn || reviews.length === 0 || !trackRef.current) return;

    const track = trackRef.current;

    const animate = () => {
      if (!hoverRef.current) {
        posRef.current -= speed;
        track.style.transform = `translateX(${posRef.current}px)`;

        if (Math.abs(posRef.current) >= track.scrollWidth / 2) {
          posRef.current = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onEnter = () => (hoverRef.current = true);
    const onLeave = () => (hoverRef.current = false);

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, [reviews, isLoggedIn]);

  /* ================= HARD BLOCK ================= */
  if (!isLoggedIn || reviews.length === 0) return null;

  const duplicatedReviews = [...reviews, ...reviews];

  const renderStars = (count) =>
    "★★★★★☆☆☆☆☆".slice(5 - count, 10 - count);

  return (
    <section className="pd-review-section">
      <div className="container">
        <div className="pd-review-header">
          <h2>
            {reviews.length}+ <span>★★★★★</span> ratings on Shopify
          </h2>
        </div>
      </div>

      <div className="pd-review-slider">
        <div className="pd-review-track" ref={trackRef}>
          {duplicatedReviews.map((review, idx) => (
            <div className="pd-review-card" key={`${review.id}-${idx}`}>
              <h3>{review.user_name}</h3>
              <p className="pd-stars">{renderStars(review.rating)}</p>
              <p>{review.description}</p>
            </div>
          ))}
        </div>
      </div>

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
