import { useEffect, useState } from "react";
import privateApi from "../../api/axiosPrivate";
import { useNavigate } from "react-router-dom";
import "./SubscribedTemplates.css";

export default function SubscribedCreators() {
  const [creators, setCreators] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await privateApi.get("/pop/users/subscriptions/");
        setCreators(res.data);
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const filteredCreators = creators.filter((c) =>
    c.fullname.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <section className="subscriptions-page mt-3">
      <div className="subs-container">
        {/* HEADER */}
        <div className="subs-header">
          <div>
            <h2>Your Subscriptions</h2>
            <p>Creators you follow and their templates</p>
          </div>

          {/* SEARCH */}
          <form className="search-box" onSubmit={(e) => e.preventDefault()}>
            <input
              className="search-input"
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </form>
        </div>

        {/* EMPTY */}
        {!filteredCreators.length ? (
          <div className="empty-state">
            <h3>No subscriptions found</h3>
            <p>Try exploring templates and follow creators.</p>
            <button onClick={() => navigate("/templates/gallery")}>
              Explore Templates
            </button>
          </div>
        ) : (
          <div className="creators-grid">
            {filteredCreators.map((c) => (
              <div className="creator-card" key={c.id}>
                <img
                  src={c.profile_image}
                  alt={c.fullname}
                  className="creator-avatar"
                />

                <h4 className="creator-name">
                  {c.fullname}
                  {c.is_verified && (
                    <i className="bi bi-patch-check-fill verified"></i>
                  )}
                </h4>

                <p className="followers">
                  {c.followers_count} followers
                </p>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/creator/${c.public_id}/templates`)
                  }
                >
                  View Templates
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
