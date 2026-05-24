import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import privateApi from "../api/axiosPrivate";
import AuthErrorScreen from "../components/common/AuthErrorScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Notification = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all"); // all, approved, pending

  // Verify Role
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const isDeveloper = parsedUser?.category === "developer";

  // Fetch categories
  useEffect(() => {
    if (!isDeveloper) return;

    privateApi.get("/pop/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setErrorMsg("Failed to load categories."));
  }, [isDeveloper]);

  // Fetch posts with active filters
  const fetchPosts = () => {
    if (!isDeveloper) return;

    setLoading(true);
    privateApi.get(`/pop/moderation/posts/?category=${category}&search=${search}&status=${status}`)
      .then((res) => {
        setPosts(res.data);
        setErrorMsg("");
      })
      .catch(() => {
        setErrorMsg("Failed to load templates for moderation.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [category, status, isDeveloper]);

  // Trigger search on enter or button click
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  // Toggle approval status via AJAX
  const handleToggleApprove = async (postId) => {
    try {
      const res = await privateApi.post(`/pop/posts/${postId}/approve/`);
      if (res.data.status) {
        setSuccessMsg(res.data.message);
        
        // Update local state instantly
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, is_approved: res.data.is_approved }
              : post
          )
        );

        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      setErrorMsg("Failed to update template approval status.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Access check guard
  if (!isDeveloper) {
    return (
      <AuthErrorScreen
        title="Permission Denied"
        message="Only core developer team members can access the Notification and Moderation Console."
        actionText="Go Home"
        actionLink="/"
      />
    );
  }

  return (
    <>
      <div className="moderation-page-wrapper">
        <div className="moderation-box">
          
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 flex-wrap gap-2">
            <div>
              <h2 className="moderation-title m-0">🔔 Notification Panel</h2>
              <p className="text-muted small m-0 mt-1">
                Moderate, approve, or reject user template submissions inside this centralized console.
              </p>
            </div>
            <span className="badge bg-purple-glow text-purple px-3 py-2 rounded-pill font-weight-bold">
              Core Developer Console
            </span>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div 
              className="alert alert-danger d-flex align-items-center justify-content-between border-0 mb-4"
              style={{ background: "rgba(246, 91, 59, 0.08)", borderLeft: "4px solid #f65b3b", color: "#d43d1c", borderRadius: "10px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill fs-5" style={{ color: "#f65b3b" }}></i>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {successMsg && (
            <div 
              className="alert alert-success d-flex align-items-center border-0 mb-4"
              style={{ background: "rgba(46, 204, 113, 0.08)", borderLeft: "4px solid #2ecc71", color: "#27ae60", borderRadius: "10px" }}
            >
              <i className="bi bi-check-circle-fill fs-5 me-2" style={{ color: "#2ecc71" }}></i>
              <div>{successMsg}</div>
            </div>
          )}

          {/* Filters Form */}
          <form onSubmit={handleSearchSubmit} className="filters-card p-3 mb-4 rounded-3">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-md-5">
                <label className="filter-label mb-2"><i className="bi bi-search me-1"></i> Search Template / Creator</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-white shadow-none"
                    placeholder="Search by title or creator name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-purple px-3">
                    Search
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="col-md-3">
                <label className="filter-label mb-2"><i className="bi bi-grid me-1"></i> Category</label>
                <select 
                  className="form-select bg-white shadow-none" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Approval status filter */}
              <div className="col-md-3">
                <label className="filter-label mb-2"><i className="bi bi-shield-check me-1"></i> Approval Status</label>
                <select 
                  className="form-select bg-white shadow-none" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>
              
              {/* Reset filter */}
              <div className="col-md-1">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100 shadow-none py-2"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setStatus("all");
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </div>
          </form>

          {/* Templates moderation list */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-purple mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted small">Loading submissions for verification...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-5 border rounded-3 bg-light">
              <i className="bi bi-clipboard2-x fs-1 text-muted"></i>
              <h5 className="fw-bold mt-3 text-dark">No Templates Found</h5>
              <p className="text-muted small">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="table-responsive border rounded-3">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light text-uppercase fs-7 text-muted">
                  <tr>
                    <th scope="col" style={{ width: "80px" }}>Preview</th>
                    <th scope="col">Template Details</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Submitted Date</th>
                    <th scope="col" style={{ width: "150px" }}>Status</th>
                    <th scope="col" className="text-center" style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      {/* Image Thumbnail */}
                      <td>
                        {post.desktop_image ? (
                          <img 
                            src={post.desktop_image} 
                            alt={post.title} 
                            className="rounded-3 border"
                            style={{ width: "65px", height: "45px", objectFit: "cover" }}
                          />
                        ) : (
                          <div 
                            className="rounded-3 bg-light border d-flex align-items-center justify-content-center"
                            style={{ width: "65px", height: "45px", color: "#888" }}
                          >
                            <i className="bi bi-image" />
                          </div>
                        )}
                      </td>

                      {/* Title & Category */}
                      <td>
                        <h6 className="fw-bold text-dark m-0">{post.title}</h6>
                        <span className="badge bg-light text-dark border small mt-1">{post.category}</span>
                      </td>

                      {/* Creator */}
                      <td>
                        <span className="fw-semibold text-muted small">{post.creator}</span>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="text-muted small">{new Date(post.created_at).toLocaleDateString()}</span>
                      </td>

                      {/* Status badge */}
                      <td>
                        {post.is_approved ? (
                          <span className="badge bg-success-glow text-success px-3 py-2 rounded-pill font-weight-bold">
                            <i className="bi bi-patch-check-fill me-1"></i> Approved
                          </span>
                        ) : (
                          <span className="badge bg-warning-glow text-warning px-3 py-2 rounded-pill font-weight-bold">
                            <i className="bi bi-hourglass-split me-1"></i> Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {/* View detailed template in a new tab */}
                          <button 
                            className="btn btn-sm btn-outline-purple shadow-none"
                            onClick={() => window.open(`/template/${post.slug}`, "_blank")}
                            title="Open detailed view in a new tab"
                          >
                            <i className="bi bi-eye"></i> View
                          </button>

                          {/* Approval toggler */}
                          {post.is_approved ? (
                            <button 
                              className="btn btn-sm btn-danger shadow-none"
                              onClick={() => handleToggleApprove(post.id)}
                            >
                              <i className="bi bi-x-circle"></i> Reject
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-success shadow-none"
                              onClick={() => handleToggleApprove(post.id)}
                            >
                              <i className="bi bi-check-circle"></i> Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .moderation-page-wrapper {
          min-height: 100vh;
          background: #ffffff;
          padding: 100px 40px 40px 40px;
          width: 100%;
          display: block;
        }

        .moderation-box {
          width: 100%;
          max-width: 100%;
          background: #ffffff;
          border-radius: 0px;
          padding: 0px;
          box-shadow: none;
        }

        .filters-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .filter-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .btn-purple {
          background: #6366f1;
          color: #fff;
          font-weight: 600;
          border: none;
        }

        .btn-purple:hover {
          background: #4f46e5;
          color: #fff;
        }

        .btn-outline-purple {
          border: 1.5px solid #6366f1;
          color: #6366f1;
          font-weight: 600;
        }

        .btn-outline-purple:hover {
          background: #6366f1;
          color: #fff;
        }

        .bg-purple-glow {
          background: rgba(99, 102, 241, 0.09);
        }

        .text-purple {
          color: #4f46e5;
        }

        .bg-success-glow {
          background: rgba(46, 204, 113, 0.12);
        }

        .text-success {
          color: #27ae60 !important;
        }

        .bg-warning-glow {
          background: rgba(243, 156, 18, 0.12);
        }

        .text-warning {
          color: #d35400 !important;
        }

        .fs-7 {
          font-size: 12.5px;
        }

        .table th {
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.5px;
        }
      `}</style>
    </>
  );
};

export default Notification;
