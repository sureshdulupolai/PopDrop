import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import privateApi from "../../api/axiosPrivate";
import AuthErrorScreen from "../common/AuthErrorScreen";
import "./templateView.css";

export default function TemplateView() {
  const { slug } = useParams();
  const navigate = useNavigate(); // ✅ Fixed missing navigate

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

  // ✅ Helper to inject Tailwind if missing
  const getPreviewHtml = (rawCode) => {
    if (!rawCode) return "";

    // If it's a snippet (no html/doctype), wrap it
    const isFullDoc = rawCode.toLowerCase().includes("<html") || rawCode.toLowerCase().includes("<!doctype");

    if (!isFullDoc) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css">
</head>
<body class="bg-gray-50 p-4">
  ${rawCode}
</body>
</html>`;
    }

    // If full doc but missing Tailwind, inject it
    if (!rawCode.includes("cdn.tailwindcss.com")) {
      return rawCode.replace(
        /<\/head>/i,
        '<script src="https://cdn.tailwindcss.com"></script></head>'
      );
    }

    return rawCode;
  };

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
          srcDoc={getPreviewHtml(html)}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
