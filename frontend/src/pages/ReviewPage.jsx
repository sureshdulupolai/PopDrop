import React, { useEffect, useState } from "react";
import { getReviews, createReview, deleteReview } from "../api/reviews";
import { useNavigate } from "react-router-dom";

const CustomerReviews = ({ isLoggedIn }) => {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await getReviews();
    if (res.data.length && res.data[0].is_mine) {
      setMyReview(res.data[0]);
      setReviews(res.data.slice(1));
    } else {
      setMyReview(null);
      setReviews(res.data);
    }
  };

  const submitReview = async () => {
    if (!text.trim() || rating === 0) return;
    setLoading(true);
    await createReview({ description: text, rating });
    setText("");
    setRating(0);
    fetchReviews();
    setLoading(false);
  };

  const removeReview = async () => {
    await deleteReview();
    fetchReviews();
  };

  return (
    <div className="review-page">

      {/* HEADER */}
      <div className="review-header">
        <h1 className="review-title text-black">Customer Reviews</h1>
        <p className="review-subtitle">
          Trusted by users worldwide. See what our customers say.
        </p>
      </div>

      <div className="review-container">

        {/* ADD REVIEW */}
        {!myReview && (
          <div className="add-review-box">
            <div>
              <h4>Add Your Review</h4>
              <p>Rate us and share your experience</p>
            </div>

            {isLoggedIn ? (
              <div className="add-review-action">

                {/* STAR SELECT */}
                <div className="star-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${(hover || rating) >= star ? "active" : ""}`}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <input
                  maxLength={150}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your review..."
                />

                <button disabled={loading} onClick={submitReview}>
                  Submit
                </button>
              </div>
            ) : (
              <button onClick={() => navigate("/login")}>
                Login to Review
              </button>
            )}
          </div>
        )}

        {/* MY REVIEW */}
        {myReview && (
          <div className="review-card my-review">
            <button className="delete-btn" onClick={removeReview}>✕</button>
            <h5>You</h5>
            <div className="stars">{"★".repeat(myReview.rating)}</div>
            <p>{myReview.description}</p>
          </div>
        )}

        {/* REVIEWS GRID */}
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="user-row">
                <div className="avatar">{r.user_name[0]}</div>
                <div>
                  <h5>{r.user_name}</h5>
                  <div className="stars">{"★".repeat(r.rating)}</div>
                </div>
              </div>
              <p>{r.description}</p>
              <span className="review-date">
                {new Date(r.created_at).toDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .review-page { padding: 100px 20px; background: #fff; font-family: Inter; }
        .review-header { text-align: center; margin-bottom: 60px; }
        .review-title { font-size: 42px; font-weight: 900;
          background: linear-gradient(90deg,#ff6a3d,#ff52b2);
          -webkit-background-clip: text; color: transparent; }

        .review-container { max-width: 1200px; margin: auto; }

        .add-review-box {
          display: flex; justify-content: space-between; gap: 20px;
          padding: 26px; background: #fff1ec; border-radius: 18px;
          margin-bottom: 50px;
        }

        .add-review-action { display: flex; align-items: center; gap: 14px; }

        .star-input .star {
          font-size: 22px; cursor: pointer; color: #ccc;
        }
        .star-input .star.active { color: #ffb400; }

        .add-review-action input {
          width: 260px; padding: 12px;
          border-radius: 10px; border: 1px solid #ddd;
        }

        .add-review-box button {
          background: linear-gradient(90deg,#ff6a3d,#ff52b2);
          border: none; color: #fff;
          padding: 12px 22px; border-radius: 30px;
          font-weight: 700; cursor: pointer;
        }

        /* FIXED CARD WIDTH GRID */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 320px);
          justify-content: center;
          gap: 28px;
        }

        .review-card {
          width: 320px;
          background: #fff7f4;
          padding: 22px;
          border-radius: 20px;
          border: 1px solid #f2d4c9;
          box-shadow: 0 10px 28px rgba(0,0,0,.08);
        }

        .my-review { margin-bottom: 50px; position: relative; }

        .delete-btn {
          position: absolute; top: 14px; right: 14px;
          background: none; border: none;
          font-size: 18px; cursor: pointer; color: #ff4d4f;
        }

        .user-row { display: flex; gap: 12px; margin-bottom: 12px; }
        .avatar {
          width: 46px; height: 46px; border-radius: 50%;
          background: #ffd6c9; display: flex;
          align-items: center; justify-content: center;
          font-weight: 800;
        }

        .stars { color: #ff8a47; font-size: 14px; }
        .review-date { font-size: 12px; color: #777; margin-top: 10px; display: block; }


        @media (max-width: 768px) {
  .reviews-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 10px; /* ⬅ vertical gap reduced */
  }

  .review-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .reviews-grid {
    grid-template-columns: 1fr; /* single column */
    gap: 0px;                  /* ⬅ big fix here */
  }

  .review-card {
    width: 100%;
    padding: 20px;
  }

  .review-date {
    margin-top: 6px; /* extra spacing kam */
  }
}
@media (max-width: 480px) {
  .review-card p {
    margin-bottom: 6px;
  }
}

      `}</style>
    </div>
  );
};

export default CustomerReviews;
