import { useNavigate } from "react-router-dom";

export default function CpmJoinTeamSection() {
  const navigate = useNavigate();

  return (
    <section className="cpm-join-section">
      {/* Background Image Layer */}
      <div className="cpm-bg-layer" />

      {/* Content */}
      <div className="cpm-content">
        <h2 className="cpm-title">Sound like the right match?</h2>
        <p className="cpm-subtitle text-white">We need top talent like you!</p>

        <button
            className="cpm-btn"
            onClick={() => navigate("/join-team")}
          >
            Join the Team
        </button>
      </div>
    </section>
  );
}