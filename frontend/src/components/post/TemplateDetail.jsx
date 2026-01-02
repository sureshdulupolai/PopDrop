import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";

export default function TemplateDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await privateApi.get(`/posts/${id}/`);
      setPost(res.data);
    } catch (err) {
      console.error("Error loading post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await privateApi.post(`/users/${post.user.id}/subscribe/`);
      setPost({ ...post, is_subscribed: res.data.subscribed });
    } catch {
      alert("Login required");
    }
  };

  const handleRating = async (value) => {
    try {
      await privateApi.post(`/posts/${post.id}/rate/`, { rating: value });
      fetchPost();
    } catch {
      alert("Login required");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post.code_content);
    await privateApi.post(`/posts/${post.id}/copy/`);
    alert("Copied to clipboard!");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div>Not found</div>;

  return (
    <>
      <section className="template-page">
        <div className="container">

          {/* TOP BAR */}
          <div className="top-bar">
            <Link to="/" className="back-btn">← Back</Link>

            <div className="creator-box">
              <img src={post.user.profile_image} alt="user" />
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
            <div className="stat-box">
              <i className="bi bi-heart-fill text-danger"></i>
              <div>{post.like_count}</div>
              <small>Likes</small>
            </div>

            <div className="stat-box">
              <i className="bi bi-star-fill text-warning"></i>
              <div>{post.avg_rating}</div>
              <small>Rating</small>
            </div>

            <div className="stat-box">
              <i className="bi bi-people-fill text-primary"></i>
              <div>{post.user.followers_count}</div>
              <small>Followers</small>
            </div>
          </div>

          {/* CODE */}
          <div className="code-card">
            <h5>Template Code</h5>
            <button className="copy-btn" onClick={handleCopy}>Copy</button>
            <pre><code>{post.code_content}</code></pre>
          </div>

          {/* RATING + SUBSCRIBE */}
          <div className="subscribe-card">
            <h5>Community Feedback</h5>

            <div className="rating-stars">
              {[1,2,3,4,5].map(i => (
                <i
                  key={i}
                  className={`bi ${i <= (hoverRating || post.avg_rating) ? "bi-star-fill" : "bi-star"}`}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRating(i)}
                />
              ))}
            </div>

            <button className="btn btn-primary rounded-pill" onClick={handleSubscribe}>
              {post.is_subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
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
        .creator-name { font-weight:600; }
        .verified { color:#2563eb; margin-left:6px; }

        .preview-card { background:#0f172a; padding:30px; border-radius:16px; margin:25px 0; }
        .preview-wrapper { display:flex; justify-content:center; gap:25px; }
        .desktop-preview { width:70%; border-radius:12px; }
        .mobile-preview { width:22%; border-radius:16px; }

        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin:25px 0; }
        .stat-box { background:#fff; padding:18px; border-radius:14px; text-align:center; }

        .code-card { background:#0b1220; color:#e5e7eb; padding:20px; border-radius:16px; position:relative; }
        .copy-btn { position:absolute; right:15px; top:15px; }

        .subscribe-card { background:#fff; padding:30px; border-radius:16px; margin-top:30px; text-align:center; }

        .rating-stars i { font-size:30px; cursor:pointer; margin:0 4px; color:#cbd5e1; }
        .rating-stars i:hover { color:#fbbf24; }
      `}</style>
    </>
  );
}
