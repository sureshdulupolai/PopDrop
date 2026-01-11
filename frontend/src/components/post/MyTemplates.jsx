import { useEffect, useState } from "react";
import privateApi from "../../api/axiosPrivate";
import TemplateCard from "./TemplateCard";
import AuthErrorScreen from "../common/AuthErrorScreen";

export default function MyTemplates() {
  const [templates, setTemplates] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 auth + role check
  const refresh = localStorage.getItem("refresh_token");
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).category : null;

  // ❌ Not logged in OR wrong role
  if (!refresh || !["designer", "developer"].includes(role)) {
    return (
      <AuthErrorScreen
        title="Access Denied"
        message="This page is only available for designers and developers."
        actionText="Go Home"
        actionLink="/"
        secondaryActionText="View Templates"
        secondaryActionLink="/templates/gallery"
      />
    );
  }

  // ✅ Fetch data only if allowed
  useEffect(() => {
    privateApi
      .get("/pop/posts/my/page/")
      .then((res) => setTemplates(res.data))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await privateApi.delete(`/pop/posts/${deleteTarget.id}/delete/`);
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <section className="my-template-page">
        <div className="page-header">
          <h2>My Templates</h2>
          <p>Manage all templates you’ve uploaded</p>
        </div>

        {loading ? (
          <div className="page-loading">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="empty-state">
            <h4>No templates yet</h4>
            <p>You haven’t uploaded any templates.</p>
          </div>
        ) : (
          <div className="row g-4">
            {templates.map((t) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={t.id}>
                <TemplateCard
                  template={t}
                  showCreator={false}
                  isOwner
                  onDelete={setDeleteTarget}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔴 DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Template?</h4>
            <p className="delete-title">
            <strong className="text-success">{deleteTarget.title}</strong>
            <br />
            <span>This action cannot be undone.</span>
            </p>

            <div className="confirm-actions">
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-light"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ===== STYLES ===== */}
      <style>{`
        .my-template-page {
          padding: 90px 60px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: Inter, system-ui;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .page-header p {
          color: #64748b;
          font-size: 14px;
        }

        .page-loading {
          min-height: 40vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #475569;
        }

        .empty-state {
          max-width: 420px;
          margin: 120px auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .empty-state h4 {
          font-weight: 800;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #64748b;
        }

        /* DELETE MODAL */
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .confirm-box {
          background: #ffffff;
          padding: 30px;
          border-radius: 18px;
          width: 340px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,0.25);
        }

        .confirm-box h4 {
          font-weight: 800;
          margin-bottom: 8px;
        }

        .confirm-box p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 20px;
        }

        .confirm-actions {
          display: flex;
          gap: 12px;
        }

        .confirm-actions button {
          flex: 1;
        }

        @media (max-width: 768px) {
          .my-template-page {
            padding: 70px 20px;
          }
        }
          .delete-title {
  font-size: 15px;
  color: #0f172a;
}

.delete-warning {
  font-size: 13px;
  color: #64748b;
}

      `}</style>
    </>
  );
}
