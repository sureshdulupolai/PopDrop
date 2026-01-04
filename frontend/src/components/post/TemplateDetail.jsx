import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";
import './templateDetail.css';

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
        setUserRating(res.data.user_rating);
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
          <div className="title-block mt-4">
            <h2 className="template-title">{post.title}</h2>
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
                        i <= (hoverRating || userRating || post.avg_rating)
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
    </>
  );
}
