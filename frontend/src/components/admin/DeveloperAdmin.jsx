import React, { useState, useEffect } from "react";
import privateApi from "../../api/axiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import "./DeveloperAdmin.css";

const DeveloperAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, visible, hidden
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await privateApi.get(`/pop-admin/posts/?status=${filter}&search=${search}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, search]);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this template?`)) return;

    try {
      await privateApi.post(`/pop-admin/posts/${id}/action/`, { action });
      fetchPosts(); // Refresh list
    } catch (error) {
      console.error("Action failed", error);
      alert("Action failed");
    }
  };

  return (
    <div className="admin-container container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👨‍💻 Developer Dashboard</h2>
        <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
      </div>

      {/* Filters */}
      <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Templates</option>
          <option value="pending">⏳ Pending Approval</option>
          <option value="visible">✅ Live / Visible</option>
          <option value="hidden">🚫 Hidden</option>
        </select>

        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-primary" onClick={fetchPosts}>Refresh</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm bg-white rounded">
            <thead className="table-dark">
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No templates found.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <img
                        src={post.desktop_image || "https://placehold.co/100x60"}
                        alt="preview"
                        className="admin-preview-img"
                      />
                    </td>
                    <td>
                      <Link to={`/template/${post.slug}`} className="fw-bold text-decoration-none text-dark">
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.user.fullname}</td>
                    <td>
                      {post.is_visible && post.is_approved ? (
                        <span className="badge bg-success">Visible</span>
                      ) : !post.is_approved ? (
                        <span className="badge bg-warning text-dark">Pending</span>
                      ) : (
                        <span className="badge bg-secondary">Hidden</span>
                      )}
                    </td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        {!post.is_approved && (
                          <button
                            className="btn btn-sm btn-success"
                            title="Approve"
                            onClick={() => handleAction(post.id, "approve")}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                        )}

                        {post.is_visible ? (
                          <button
                            className="btn btn-sm btn-warning"
                            title="Hide"
                            onClick={() => handleAction(post.id, "hide")}
                          >
                            <i className="bi bi-eye-slash"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-info text-white"
                            title="Make Visible"
                            onClick={() => handleAction(post.id, "approve")}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-danger"
                          title="Delete"
                          onClick={() => handleAction(post.id, "delete")}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )
      }
    </div >
  );
};

export default DeveloperAdmin;
