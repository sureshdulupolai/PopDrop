import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/axiosPublic";

const TemplateGallery = ({ isLoggedIn }) => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadPosts("all", "");
  }, []);

  const loadCategories = async () => {
    const res = await publicApi.get("/pop/categories/");
    setCategories(res.data);
  };

  const loadPosts = async (cat, q) => {
    setLoading(true);
    const res = await publicApi.get("/pop/posts/", {
      params: { category: cat, search: q },
    });
    setPosts(res.data);
    setActiveCat(cat);
    setLoading(false);
  };

  const onSearch = (e) => {
    e.preventDefault();
    loadPosts(activeCat, search);
  };

  // ===== Empty state logic =====
  const getEmptyStateContent = () => {
    // Search empty
    if (search.trim()) {
      return {
        title: "No results found",
        desc: `We couldn’t find any templates matching “${search}”. Try a different keyword.`,
        icon: "🔍",
      };
    }

    // Category empty (not ALL)
    if (activeCat !== "all") {
      const catName =
        categories.find((c) => c.slug === activeCat)?.name || "This category";

      return {
        title: `${catName} templates unavailable`,
        desc: `There are currently no templates published under ${catName}.`,
        icon: "📂",
      };
    }

    // All empty
    return {
      title: "No templates available yet",
      desc: "Templates will appear here once creators start publishing.",
      icon: "📦",
    };
  };

  return (
    <>
      {/* HEADER */}
      <section className="gallery-header py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="fw-bold mb-1">Browse Templates</h5>
              <p className="text-muted small">
                Free & community driven templates
              </p>
            </div>

            {/* SEARCH */}
            <form onSubmit={onSearch} className="search-box d-flex">
              <input
                className="form-control search-input"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary search-btn">Search</button>
            </form>
          </div>

          {/* CATEGORIES */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            <span
              className={`category-pill ${
                activeCat === "all" ? "active" : ""
              }`}
              onClick={() => loadPosts("all", "")}
            >
              All
            </span>

            {categories.map((cat) => (
              <span
                key={cat.id}
                className={`category-pill ${
                  activeCat === cat.slug ? "active" : ""
                }`}
                onClick={() => loadPosts(cat.slug, "")}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-5 ownbg-color">
        <div className="container">
          {loading && (
            <p className="text-center text-muted">Loading templates...</p>
          )}

          {/* EMPTY STATE */}
          {!loading && posts.length === 0 && (
            <div className="empty-state">
              <div className="empty-card">
                <div className="empty-icon">{getEmptyStateContent().icon}</div>
                <h4>{getEmptyStateContent().title}</h4>
                <p>{getEmptyStateContent().desc}</p>
                {(search || activeCat !== "all") && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSearch("");
                      loadPosts("all", "");
                    }}
                  >
                    View all templates
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="row g-4">
            {posts.map((p) => (
              <div key={p.id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card template-card h-100">
                  <img src={p.desktop_image} alt={p.title} />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold">{p.title}</h6>

                    <div className="template-meta">
                      <span>
                        <i className="bi bi-person"></i> {p.creator}
                      </span>
                      <span>
                        <i className="bi bi-clock"></i>{" "}
                        {new Date(p.created_at).toDateString()}
                      </span>
                    </div>

                    <div className="rating mb-2">
                      {"★".repeat(Math.round(p.avg_rating || 0))}
                    </div>

                    <p className="text-muted small">
                      {p.category || "Uncategorized"}
                    </p>

                    <button
                      className="btn btn-outline-primary mt-auto"
                      onClick={() => navigate(`/template/${p.id}`)}
                    >
                      View Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UI ONLY CSS */}
      <style>{`
        body {
          background-color: #f8f9fa !important;
        }

        .gallery-header {
          margin-top: 68px !important;
          background: #ffffff !important;
          border-bottom: 1px solid #e5e7eb;
        }
          .ownbg-color{
          background-color: #f8f9fa !important;
          }

        /* SEARCH */
        .search-box {
          background: #f8fafc;
          border-radius: 10px;
          padding: 4px;
        }

        .search-input {
          width: 300px;
          height: 36px;
          border: none;
          box-shadow: none;
        }

        .search-input:focus {
          box-shadow: none;
        }

        .search-btn {
          height: 36px;
          padding: 0 18px;
          font-size: 14px;
        }

        /* CATEGORY */
        .category-pill {
          padding: 6px 14px;
          font-size: 13px;
          border-radius: 20px;
          background-color: #f1f5f9;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-pill:hover {
          background-color: #e0e7ff;
          color: #3730a3;
        }

        .category-pill.active {
          background-color: #4f46e5;
          color: #ffffff;
        }

        /* CARD */
        .template-card img {
          height: 180px;
          width: 100%;
          object-fit: cover;
        }

        .template-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .template-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .template-meta {
          font-size: 12px;
          color: #64748b;
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 6px;
        }

        /* EMPTY STATE */
        .empty-state {
          display: flex;
          justify-content: center;
          padding: 80px 20px;
        }

        .empty-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 55px 45px;
          text-align: center;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0,0,0,0.08);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 18px;
        }

        .empty-card h4 {
          font-weight: 700;
          margin-bottom: 12px;
          color: #0f172a;
        }

        .empty-card p {
          color: #64748b;
          font-size: 14.5px;
          margin-bottom: 24px;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
};

export default TemplateGallery;
