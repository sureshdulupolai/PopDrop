import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/axiosPublic";
import TemplateCard from "./TemplateCard";

const TemplateGallery = ({ isLoggedIn }) => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
                className="search-input"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn">Search</button>
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
                <TemplateCard template={p} />
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
        /* SEARCH CONTAINER */
.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border-radius: 14px;
  padding: 4px;
  border: 1px solid #e5e7eb;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.search-box:hover {
  border-color: #c7d2fe;
}

.search-box:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* INPUT */
.search-input {
  width: 280px;
  height: 38px;
  border: none;
  outline: none;
  padding: 0 12px;
  font-size: 14px;
  background: transparent;
  color: #0f172a;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* BUTTON */
.search-btn {
  height: 38px;
  padding: 0 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-btn:hover {
  background: #4f46e5 !important;
}


.search-btn:active {
  transform: scale(0.97);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }
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
      `}</style>
    </>
  );
};

export default TemplateGallery;
