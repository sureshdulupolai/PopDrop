import { useNavigate } from "react-router-dom";

export default function TemplateCard({
  template,
  showCreator = true,
  absoluteImage = false,
  isOwner = false,
  onDelete
 }) {
  const navigate = useNavigate();

  const truncate = (text, limit = 18) =>
    text?.length > limit ? text.slice(0, limit) + ".." : text;

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return past.toDateString();
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
              {truncate(template.creator, 17)}
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
            ? truncate(template.description, 64)
            : "No description available"}
        </p>

        {/* 🔥 ACTIONS */}
          {isOwner ? (
            <div className="template-actions">
              <button
                className="action-btn edit-btn"
                onClick={() => navigate(`/template/${template.slug}/edit`)}
              >
                ✏️ Edit
              </button>

              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(template)}
              >
                🗑 Delete
              </button>

              <button
                className="action-btn delete-btn"
                onClick={() => navigate(`/template/${template.slug}`)}
              >
              View
            </button>

            </div>

            
          ) : (
            <button
              className="btn btn-outline-primary mt-auto"
              onClick={() => navigate(`/template/${template.slug}`)}
            >
              View Template
            </button>
          )}
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
.template-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.action-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

/* EDIT */
.edit-btn {
  border: 1.5px solid #e2e8f0;
  color: #0f172a;
}

.edit-btn:hover {
  background: #f1f5f9;
}

/* DELETE */
.delete-btn {
  border: 1.5px solid #fecaca;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
}

      `}
    </style>
    </>
  );
}
