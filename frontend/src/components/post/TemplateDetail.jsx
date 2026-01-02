import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);   // ✅ THIS WAS MISSING
  const [copyCount, setCopyCount] = useState(0);
  const [copyDisabled, setCopyDisabled] = useState(false);

  // 🔐 AUTH CHECK
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
      } catch (err) {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);


    useEffect(() => {
      const lastCopyTime = localStorage.getItem(`copy_${post?.id}`);

      if (lastCopyTime) {
        const diff = Date.now() - Number(lastCopyTime);

        if (diff < 5 * 60 * 1000) {
          setCopyDisabled(true);

          // auto-enable after remaining time
          setTimeout(() => {
            setCopyDisabled(false);
            localStorage.removeItem(`copy_${post.id}`);
          }, 5 * 60 * 1000 - diff);
        }
      }
    }, [post]);

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
    } catch {}
  };

  // ⭐ RATE
  const handleRating = async (value) => {
    if (!checkAuth()) return;

    try {
      await privateApi.post(`/pop/posts/${post.id}/rate/`, { rating: value });
      setPost((prev) => ({ ...prev, avg_rating: value }));
    } catch {}
  };

  // 📋 COPY
  const handleCopy = async () => {
    if (!post?.code_content || copyDisabled) return;

    try {
      // Copy to clipboard
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

      // Backend update
      await privateApi.post(`/pop/posts/${post.id}/copy/`);

      // Save timestamp
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return null;

  return (
    <>
      <section className="template-page">
        <div className="container">

          {/* HEADER */}
          <div className="top-bar">
          <div className="left-bar">
            <Link to="/" className="back-btn">← Back</Link>
          </div>

          <div className="right-bar">
            <div className="creator-box">
              <img src={post.user.profile_image} alt={post.user.profile_image} />
              <div>
                <div className="creator-name">
                  {post.user.fullname}
                  {post.user.is_verified && (
                    <i className="bi bi-patch-check-fill verified"></i>
                  )}
                </div>
                <small>{post.user.followers_count} followers</small>
              </div>
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

      `}</style>
    </>
  );
}
