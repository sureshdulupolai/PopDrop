import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateApi from "../../api/axiosPrivate";
import TemplateCard from "./TemplateCard";

export default function CreatorTemplates() {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await privateApi.get(
          `/pop/creator/${publicId}/templates/`
        );
        setCreator(res.data.creator);
        setTemplates(res.data.templates);
        setCount(res.data.template_count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [publicId]);

  if (loading) return <div className="page-loading">Loading creator...</div>;

  return (
    <>
      <section className="creator-page">
        {/* ================= CREATOR PROFILE ================= */}
        {creator && (
          <div className="creator-profile mb-4">
            <img
              src={creator.profile_image}
              alt={creator.fullname}
              className="creator-avatar"
            />

            <div className="creator-info">
              <div className="creator-name-row">
                <h2>{creator.fullname}</h2>

                {creator.is_verified ? (
                  <span className="badge verified">
                    <i className="bi bi-patch-check-fill"></i> Verified
                  </span>
                ) : (
                  <span className="badge not-verified">
                    <i className="bi bi-patch-check"></i> Not verified
                  </span>
                )}
              </div>

              <p className="creator-username">
                @{creator.public_id}
              </p>

              <p className="creator-meta">
                <strong>{creator.followers_count}</strong>
                <span>Followers</span>

                <strong>{count}</strong>
                <span>Templates</span>
              </p>
            </div>
          </div>
        )}

        {/* ================= TEMPLATES ================= */}
        {!templates.length ? (
          <div className="empty-state">
            <h3>No templates yet</h3>
            <p>This creator hasn’t published any templates.</p>
            <button onClick={() => navigate("/templates/gallery")}>
              Explore Templates
            </button>
          </div>
        ) : (
          <div className="container">
            <div className="row g-4">
              {templates.map((t) => (
                <div key={t.id} className="col-xl-3 col-lg-4 col-md-6">
                  <TemplateCard
                    template={t}
                    showCreator={false}
                    absoluteImage={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================= STYLES ================= */}
      <style>{`
        .creator-page {
          padding: 70px 0;
          background: #f8fafc;
          min-height: 100vh;
          font-family: Inter, system-ui;
        }

        /* PROFILE CARD */
        .creator-profile {
          max-width: 1000px;
          margin: 20px auto 20px;
          background: #ffffff;
          border-radius: 20px;
          padding: 22px 32px; /* 🔥 FIXED BALANCED PADDING */
          display: flex;
          align-items: center;
          gap: 22px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }

        .creator-avatar {
          width: 82px;
          height: 82px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e7eb;
          flex-shrink: 0;
        }

        .creator-info {
          flex: 1;
        }

        .creator-name-row {
          display: flex;
          align-items: center;
          gap: 0px;
          flex-wrap: wrap;
        }

        .creator-info h2 {
          font-size: 21px;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }

        .creator-username {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0 3px;
        }

        .creator-meta {
          font-size: 13px;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .creator-meta strong {
          color: #0f172a;
          font-weight: 700;
          margin-left: 8px;
        }

        .creator-meta strong:first-child {
          margin-left: 0;
        }

        /* BADGES */
        .badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .badge.verified {
          background: #eef2ff;
          color: #4338ca;
        }

        .badge.not-verified {
          background: #fef2f2;
          color: #dc2626;
        }

        /* EMPTY */
        .empty-state {
          max-width: 420px;
          margin: 120px auto;
          background: #fff;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        .empty-state h3 {
          font-weight: 800;
        }

        .empty-state p {
          font-size: 14px;
          color: #64748b;
        }

        .empty-state button {
          padding: 12px 26px;
          border-radius: 999px;
          border: none;
          background: #4f46e5;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        /* LOADING */
        .page-loading {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
        }

        @media(max-width:768px){
          .creator-profile{
            flex-direction: column;
            text-align: center;
          }

          .creator-meta{
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
