import { Link } from "react-router-dom";
import "./AuthErrorScreenAES.css";

export default function AuthErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred",
  actionText = "Go Home",
  actionLink = "/",
  secondaryActionText,
  secondaryActionLink
}) {
  return (
    <section className="AES-wrapper">
      <div className="AES-card">
        <div className="AES-icon">
          <i className="bi bi-exclamation-triangle"></i>
        </div>

        <h3 className="AES-title">{title}</h3>

        <p className="AES-message">
          {message}
        </p>

        <div className="AES-actions">
          <Link to={actionLink} className="AES-btn AES-btn-primary">
            {actionText}
          </Link>

          {secondaryActionText && secondaryActionLink && (
            <Link
              to={secondaryActionLink}
              className="AES-btn AES-btn-outline"
            >
              {secondaryActionText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
