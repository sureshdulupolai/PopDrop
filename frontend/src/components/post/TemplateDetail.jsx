import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyDisabled, setCopyDisabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const currentUserId = localStorage.getItem("user_id")
    ? Number(localStorage.getItem("user_id"))
    : null;

  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
      return false;
    }
    return true;
  };

  // 🔄 FETCH TEMPLATE
  useEffect(() => {
    if (!checkAuth()) return;

    const fetchPost = async () => {
      try {
        const res = await privateApi.get(`/pop/posts/${slug}/`);
        setPost(res.data);
        setCopyCount(res.data.copy_count || 0);
        console.log("Fetched post:", res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // 📋 COPY COOLDOWN
  useEffect(() => {
    if (!post) return;
    const lastCopyTime = localStorage.getItem(`copy_${post.id}`);
    if (lastCopyTime) {
      const diff = Date.now() - Number(lastCopyTime);
      if (diff < 5 * 60 * 1000) {
        setCopyDisabled(true);
        setTimeout(() => {
          setCopyDisabled(false);
          localStorage.removeItem(`copy_${post.id}`);
        }, 5 * 60 * 1000 - diff);
      }
    }
  }, [post]);

  // 🔔 SUBSCRIBE STATUS (clean single effect)
  useEffect(() => {
    if (!post || !currentUserId || currentUserId === post.user.id) return;

    const fetchSubscription = async () => {
      try {
        const res = await privateApi.get(
          `/pop/users/${post.user.id}/subscribe-status/`
        );
        console.log("Subscription status:", res.data.subscribed);
        setIsSubscribed(res.data.subscribed);
      } catch (err) {
        console.error("Failed to fetch subscription status", err);
        setIsSubscribed(post.user.is_subscribed || false);
      }
    };

    fetchSubscription();
  }, [post, currentUserId]);

  // ❤️ LIKE
  const handleLike = async () => {
    if (!checkAuth()) return;
    try {
      const res = await privateApi.post(`/pop/posts/${post.id}/like/`);
      setPost((prev) => ({
        ...prev,
        like_count: res.data.like_count,
        is_liked: res.data.liked,
      }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // ⭐ RATE
  const handleRating = async (value) => {
    if (!checkAuth()) return;
    try {
      await privateApi.post(`/pop/posts/${post.id}/rate/`, { rating: value });
      setPost((prev) => ({ ...prev, avg_rating: value }));
    } catch (err) {
      console.error("Rating failed", err);
    }
  };

  // 📋 COPY
  const handleCopy = async () => {
    if (!post?.code_content || copyDisabled) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(post.code_content);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = post.code_content;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopyCount((prev) => prev + 1);
      privateApi.post(`/pop/posts/${post.id}/copy/`);
      localStorage.setItem(`copy_${post.id}`, Date.now());

      setCopied(true);
      setCopyDisabled(true);
      setTimeout(() => {
        setCopied(false);
        setCopyDisabled(false);
        localStorage.removeItem(`copy_${post.id}`);
      }, 5 * 60 * 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // 🔔 SUBSCRIBE BUTTON
  const handleSubscribe = async () => {
    if (!checkAuth() || subLoading) return;
    try {
      setSubLoading(true);
      const res = await privateApi.post(
        `/pop/users/${post.user.id}/subscribe/`
      );
      setIsSubscribed(res.data.subscribed);

      // update followers count
      setPost((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          followers_count: res.data.subscribed
            ? prev.user.followers_count + 1
            : prev.user.followers_count - 1,
        },
      }));
    } catch (err) {
      console.error("Subscribe failed", err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // go back
    } else {
      navigate("/templates/gallery"); // default fallback
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div>No post found</div>;

  console.log("Render: post.user.id=", post.user.id, "currentUserId=", currentUserId);

  return (
    <>
      <section className="template-page">
        <div className="container">

          {/* HEADER */}
          <div className="top-bar">
          <div className="left-bar">
            <button onClick={handleBack} className="back-btn">
              ← Back
            </button>
          </div>

          <div className="right-bar">

            <div className="creator-box">
              <img src={post.user.profile_image} alt="creator" />

              <div className="creator-info">
                <div className="creator-name">
                  {post.user.fullname}
                  {post.user.is_verified && (
                    <i className="bi bi-patch-check-fill verified"></i>
                  )}
                </div>
                <small>{post.user.followers_count} followers</small>
              </div>

            {post && currentUserId && currentUserId !== post.user.id && (
              <button
                className={`subscribe-btn ${isSubscribed ? "subscribed" : ""}`}
                onClick={handleSubscribe}
                disabled={subLoading}
              >
                {subLoading ? (
                  <span className="loader"></span>
                ) : isSubscribed ? (
                  <>
                    <i className="bi bi-check-circle-fill"></i> Subscribed
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg"></i> Subscribe
                  </>
                )}
              </button>
            )}

            </div>

          </div>
        </div>


          {/* TITLE */}
          <div className="title-block">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </div>

          {/* PREVIEW */}
          <div className="preview-card">
            <div className="preview-wrapper">
              <img src={post.desktop_image} className="desktop-preview" />
              {post.mobile_image && (
                <img src={post.mobile_image} className="mobile-preview" />
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-box" onClick={handleLike}>
              <i className={`bi ${post.is_liked ? "bi-heart-fill text-danger" : "bi-heart"}`} />
              <div>{post.like_count}</div>
              <small>Likes</small>
            </div>

            <div className="stat-box">
              <i className="bi bi-star-fill text-warning" />
              <div>{post.avg_rating}</div>
              <small>Rating</small>
            </div>

            <div className="stat-box">
              <i className="bi bi-eye-fill text-primary" />
              <div>{post.view_count}</div>
              <small>Views</small>
            </div>

            {/* ✅ COPY COUNT */}
            <div className="stat-box">
              <i className="bi bi-clipboard-check text-success" />
              <div>{copyCount}</div>
              <small>Copied</small>
            </div>
          </div>

          {/* CODE */}
          <div className="code-card">
            <div className="code-header">
              <h5>Template Code</h5>
              <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                  disabled={copyDisabled}
                >
                  {copyDisabled ? "Copied" : copied ? "Copied ✓" : "Copy Code"}
                </button>

            </div>
            <pre>
              <code>{post.code_content}</code>
            </pre>
          </div>

          {/* REVIEW */}
          <div className="review-section">
            <div className="review-card mb-5">
              <h4>Community Feedback</h4>

              <div className="rating-box">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i
                      key={i}
                      className={`bi ${
                        i <= (hoverRating || post.avg_rating)
                          ? "bi-star-fill active"
                          : "bi-star"
                      }`}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(i)}
                    />
                  ))}
                </div>

                <div className="rating-info">
                  <span className="rating-value">
                    {post.avg_rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="rating-text">Average Rating</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STYLES */}
      <style>{`
        .template-page { padding-top:90px; background:#f8fafc; }
        .top-bar { display:flex; justify-content:space-between; align-items:center; }
        .back-btn { text-decoration:none; background:#eef2ff; padding:6px 14px; border-radius:20px; color:#4338ca; }
        .creator-box { display:flex; align-items:center; gap:12px; }
        .creator-box img { width:42px; height:42px; border-radius:50%; }
        .verified { color:#2563eb; margin-left:6px; }

        .preview-card { background:#0f172a; padding:30px; border-radius:16px; margin:25px 0; }
        .preview-wrapper { display:flex; justify-content:center; gap:25px; }
        .desktop-preview { width:70%; border-radius:12px; background:#fff; padding:2px; }
        .mobile-preview { width:22%; border-radius:16px; background:#fff; padding:2px; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 25px 0;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
        }

        .stat-box {
          background: #fff;
          padding: 16px 10px;
          border-radius: 14px;
          text-align: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .stat-box:hover {
          transform: translateY(-2px);
          // box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        }

        .code-card { background:#0b1220; color:#e5e7eb; padding:20px; border-radius:16px; position:relative; }
        .copy-btn { position:absolute; right:15px; top:15px; }

        .code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.copy-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.25s ease;
}

.copy-btn:hover {
  background: #1d4ed8;
}

.copy-btn.copied {
  background: #16a34a;
}


        .rating-stars i { font-size:30px; cursor:pointer; margin:0 4px; color:#cbd5e1; }
        .rating-stars i:hover { color:#fbbf24; }

        .review-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  margin-top: 30px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  text-align: center;
}

.review-section {
  padding-bottom: 1px;
}


.review-card h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
  color: #111827;
}

.rating-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stars {
  display: flex;
  gap: 10px;
}

.stars i {
  font-size: 34px;
  cursor: pointer;
  color: #d1d5db;
  transition: 0.25s ease;
}

.stars i.active {
  color: #facc15;
}

.stars i:hover {
  transform: scale(1.15);
}

.rating-info {
  margin-top: 4px;
}

.rating-value {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.rating-text {
  font-size: 13px;
  color: #6b7280;
}
.creator-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.creator-info {
  flex: 1;
}

.subscribe-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);
}

.subscribe-btn.subscribed {
  background: #e5e7eb;
  color: #111827;
}

.subscribe-btn.subscribed:hover {
  background: #d1d5db;
}

.subscribe-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

      `}</style>
    </>
  );
}
