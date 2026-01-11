import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";
import AuthErrorScreen from "../common/AuthErrorScreen";
import "./templateDetail.css";

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
  const [userRating, setUserRating] = useState(0);
  const [notFound, setNotFound] = useState(false);

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

  // 🔐 BLOCK COPY / INSPECT / RIGHT CLICK
  useEffect(() => {
    const blockKeys = (e) => {
      if (
        (e.ctrlKey && ["c", "u", "s"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const blockRightClick = (e) => e.preventDefault();

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", blockRightClick);

    return () => {
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("contextmenu", blockRightClick);
    };
  }, []);

  // 🔍 DEVTOOLS DETECTION
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        document.body.innerHTML = "";
        navigate("/templates/gallery", { replace: true });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 📸 SCREENSHOT / TAB SWITCH BLUR
  useEffect(() => {
    const handleVisibility = () => {
      document.body.style.filter = document.hidden ? "blur(20px)" : "none";
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 🔄 FETCH TEMPLATE (NO AUTH CHECK HERE)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await privateApi.get(`/pop/posts/${slug}/`);
        setPost(res.data);
        setCopyCount(res.data.copy_count || 0);
        setUserRating(res.data.user_rating);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
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

  // 🔔 SUBSCRIBE STATUS
  useEffect(() => {
    if (!post || !currentUserId || currentUserId === post.user.id) return;

    privateApi
      .get(`/pop/users/${post.user.id}/subscribe-status/`)
      .then((res) => setIsSubscribed(res.data.subscribed))
      .catch(() => setIsSubscribed(false));
  }, [post, currentUserId]);

  // ❤️ LIKE
  const handleLike = async () => {
    if (!checkAuth()) return;
    const res = await privateApi.post(`/pop/posts/${post.id}/like/`);
    setPost((p) => ({
      ...p,
      like_count: res.data.like_count,
      is_liked: res.data.liked,
    }));
  };

  // ⭐ RATE
  const handleRating = async (value) => {
    if (!checkAuth()) return;

    try {
      const res = await privateApi.post(
        `/pop/posts/${post.id}/rate/`,
        { rating: value }
      );

      setUserRating(res.data.rating);

      setPost((prev) => ({
        ...prev,
        avg_rating: res.data.avg_rating,
        review_count: res.data.review_count,
      }));
    } catch (err) {
      console.error("Rating failed", err);
    }
  };

  // 📋 COPY (ONLY BUTTON)
  const handleCopy = async () => {
    if (!post?.code_content || copyDisabled) return;

    // Copy code to clipboard
    await navigator.clipboard.writeText(post.code_content);

    // Backend ko notify karo, yahan authentication optional
    privateApi.post(`/pop/posts/${post.id}/copy/`).catch((err) => {
      console.error("Copy count update failed", err);
    });

    // Frontend state update
    setCopyCount((p) => p + 1);
    setCopied(true);
    setCopyDisabled(true);
    localStorage.setItem(`copy_${post.id}`, Date.now());

    setTimeout(() => {
      setCopied(false);
      setCopyDisabled(false);
      localStorage.removeItem(`copy_${post.id}`);
    }, 5 * 60 * 1000);
  };


  const handleSubscribe = async () => {
    if (!checkAuth() || subLoading) return;

    setSubLoading(true);

    try {
      const res = await privateApi.post(
        `/pop/users/${post.user.id}/subscribe/`
      );

      const backendSubscribed = res.data.subscribed;

      setPost((prev) => {
        if (!prev) return prev;

        let newCount = prev.user.followers_count;

        if (backendSubscribed && !isSubscribed) {
          newCount += 1;
        } else if (!backendSubscribed && isSubscribed) {
          newCount -= 1;
        }

        return {
          ...prev,
          user: {
            ...prev.user,
            followers_count: Math.max(newCount, 0),
          },
        };
      });

      setIsSubscribed(backendSubscribed);
    } catch (err) {
      console.error("Subscribe error", err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/templates/gallery");
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (notFound) {
    return (
      <AuthErrorScreen
        title="Template Not Found"
        message={
          <>
            No template exists for the URL slug <br />
            <strong>{slug}</strong>.
          </>
        }
        actionText="Browse Templates"
        actionLink="/templates/gallery"
        secondaryActionText="Go Home"
        secondaryActionLink="/"
      />
    );
  }

  return (
    <>
      <section className="template-page no-select">
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
          <div className="title-block mt-4">
            <h2 className="template-title">
              {post.title}

              <button
                className="inline-open-btn"
                title="View Template"
                onClick={() =>
                  window.open(`/template-view/${post.slug}`, "_blank")
                }
              >
                <i className="bi bi-box-arrow-up-right"></i>
                <span>View</span>
              </button>
            </h2>

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
              <div>{Number(post.avg_rating).toFixed(1)}</div>
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

            <pre className="code-scroll">
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
                        i <= (hoverRating || userRating)
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
                  <span className="rating-value me-2">
                    {userRating || 0}
                  </span>
                  <span className="rating-text">Your Rating</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>
        {`
          /* CODE CARD */
.code-card {
  background: #0b1220;
  border-radius: 14px;
  padding: 14px;
  margin-top: 30px;
}

/* PRE SCROLL AREA */
.code-scroll {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px;
  border-radius: 12px;
  color: #e5e7eb;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

/* CODE FONT */
.code-scroll code {
  font-family: "Fira Code", monospace;
}

/* ===== CUSTOM SCROLLBAR (CHROME / EDGE) ===== */
.code-scroll::-webkit-scrollbar {
  height: 8px;
}

.code-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.code-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.code-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}

/* ===== FIREFOX SUPPORT ===== */
.code-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
}

.template-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
}

/* Inline View Button */
.inline-open-btn {
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  background: #6366f1;
  color: #ffffff;
  border-color: #6366f1;

  border-radius: 999px;

  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;
}

/* Icon smaller */
.inline-open-btn i {
  font-size: 13px;
}

/* Hover */
.inline-open-btn:hover {
  background: #f1f5f9;
  color: #475569;

  border: 1px solid #e2e8f0;
  transform: translateY(-1px);
}

/* Mobile: text hide */
@media (max-width: 576px) {
  .inline-open-btn span {
    display: none;
  }
}

        `}
      </style>
    </>
  );
}
