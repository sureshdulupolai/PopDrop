import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import privateApi from "../../api/axiosPrivate";
import AuthErrorScreen from "../common/AuthErrorScreen";
import "./templateView.css";

export default function TemplateView() {
  const { slug } = useParams();

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await privateApi.get(`/pop/posts/${slug}/`);

        if (!res.data?.code_content) {
          setNotFound(true);
        } else {
          setHtml(res.data.code_content);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  /* loader */
  if (loading) {
    return (
      <div className="preview-loader">
        <div className="spinner"></div>
        <p>Loading template preview…</p>
      </div>
    );
  }

  /* ❌ slug not found */
  if (notFound) {
    return (
      <AuthErrorScreen
        title="Template Not Found"
        message={
          <>
            The template with slug <strong>{slug}</strong> does not exist
            or may have been removed.
          </>
        }
        actionText="Browse Templates"
        actionLink="/templates/gallery"
        secondaryActionText="Go Home"
        secondaryActionLink="/"
      />
    );
  }

  return (
    <div className="template-preview-page">
      {/* TOP BAR */}
      <div className="preview-topbar">
        {/* LEFT */}
        <div className="topbar-left">
            <button
                onClick={() => navigate(`/template/${slug}`)}
                className="back-btn"
                >
                ← Back
            </button>
        </div>

        {/* CENTER */}
        <div className="topbar-center">
          <span className="preview-title" title={slug}>
            {slug.replace(/-/g, " ")}
          </span>
        </div>

        {/* RIGHT (EMPTY FOR BALANCE) */}
        <div className="topbar-right"></div>
      </div>

      {/* PREVIEW */}
      <div className="preview-wrapper">
        <iframe
          title="Template Preview"
          srcDoc={html}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
