import "./formCP.css";

export default function InfoCard({ type, message }) {
  return (
    <div className={`cpm-info-card ${type}`}>
      {message}
    </div>
  );
}
