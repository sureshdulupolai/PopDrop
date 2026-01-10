import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import privateApi from "../../api/axiosPrivate";
import "./templateView.css";

export default function TemplateView() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await privateApi.get(`/pop/posts/${slug}/`);
        setHtml(res.data.code_content);
      } catch {
        setHtml("<h1 style='text-align:center'>Template not found</h1>");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  if (loading) {
    return (
      <div className="preview-loader">
        <div className="spinner"></div>
        <p>Loading template preview…</p>
      </div>
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
