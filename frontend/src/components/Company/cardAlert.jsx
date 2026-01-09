export default function InfoCard({ type = "info", message }) {
  if (!message) return null;

  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <>
    <section style={{ backgroundColor: "white", minHeight: "80vh" }} className="page-center">
      <div className={`info-card ${type}`}>
        <span className="info-icon">{icons[type]}</span>
        <span className="info-text">{message}</span>
      </div>
    </section>

      <style>{`
      .page-center {
  min-height: 80vh;
  display: flex;
  align-items: center;      /* vertical center */
  justify-content: center;  /* horizontal center */
  background: #fff;
}

        .info-card {
          max-width: 520px;
          margin: 0px auto;
          padding: 18px 22px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 15px;
          font-weight: 500;
          box-shadow: 0 18px 40px rgba(0,0,0,0.08);
          animation: slideFade 0.35s ease;
        }

        .info-icon {
          font-size: 22px;
          line-height: 1;
        }

        .info-text {
          flex: 1;
        }

        /* TYPES */
        .info-card.success {
          background: #e8fff1;
          color: #137333;
          border-left: 6px solid #22c55e;
        }

        .info-card.warning {
          background: #fff7e6;
          color: #8a5a00;
          border-left: 6px solid #f59e0b;
        }

        .info-card.error {
          background: #ffecec;
          color: #b00020;
          border-left: 6px solid #ef4444;
        }

        .info-card.info {
          background: #eef2ff;
          color: #3730a3;
          border-left: 6px solid #6366f1;
        }

        @keyframes slideFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
