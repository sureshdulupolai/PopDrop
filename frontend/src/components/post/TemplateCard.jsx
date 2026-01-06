import { useNavigate } from "react-router-dom";

export default function TemplateCard({ template, showCreator = true, absoluteImage = false }) {
  const navigate = useNavigate();

  const truncate = (text, limit = 18) =>
    text?.length > limit ? text.slice(0, limit) + ".." : text;

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return new Date(dateString).toDateString();
  }

  const imageSrc = absoluteImage
    ? template.desktop_image
    : `http://localhost:8000/${template.desktop_image}`;

  return (
    <>
    <div className="card template-card h-100">
      <img
        src={imageSrc}
        alt={template.title}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="fw-semibold">{template.title}</h6>

        <div className="template-meta">
          {showCreator && (
            <span>
              <i className="bi bi-person"></i>{" "}
              {truncate(template.creator)}
            </span>
          )}

          <span title={new Date(template.created_at).toDateString()}>
            <i className="bi bi-clock"></i>{" "}
            {timeAgo(template.created_at)}
          </span>
        </div>

        <div className="rating mb-2">
          {"★".repeat(Math.round(template.avg_rating || 0))}
        </div>

        <p className="text-muted small">
          {template.description
            ? template.description.split(" ").slice(0, 8).join(" ") + "..."
            : "No description available"}
        </p>

        <button
          className="btn btn-outline-primary mt-auto"
          onClick={() => navigate(`/template/${template.slug}`)}
        >
          View Template
        </button>
      </div>
    </div>
    <style>
      {`
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
  margin-bottom: 6px;
}
  .rating {
  color: #facc15; /* yellow (tailwind yellow-400) */
  font-size: 15px;
  letter-spacing: 1px;
}

      `}
    </style>
    </>
  );
}
