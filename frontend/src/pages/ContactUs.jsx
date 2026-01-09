import { useEffect, useState } from "react";
import api from "../api/axios";
import InfoCard from "../components/Company/cardAlert";

export default function ContactUs() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info");

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const isValid = form.title.trim() && form.description.trim();

  useEffect(() => {
    api.get("/contact/")
      .then(res => {
        if (res.data.has_pending) {
          setPending(true);
          setMessage("⏳ Your previous request is still under review.");
          setType("warning");
        }
      });
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setMessage("⚠️ Please fill all required fields.");
      setType("warning");
      return;
    }

    try {
      await api.post("/contact/", form);
      setMessage("✅ Your message has been sent successfully!");
      setType("success");
      setPending(true);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong");
      setType("error");
    }
  };

  if (pending) {
    return (
        <InfoCard
        type="warning"
        message="⏳ Your request is under review. You can submit a new one once it is resolved."
        />
    );
    }

    if (type === "success") {
    return (
        <InfoCard
        type="success"
        message={message}
        />
    );
    }

  return (
    <section className="cp-wrapper">
      <form className="cp-card" onSubmit={submit}>
        <h2>Contact Us</h2>
        <p className="cp-subtitle">
          Share your thoughts, issues, or feedback with us
        </p>

        {message && (
          <div className={`cp-alert inline ${type}`}>
            {message}
          </div>
        )}

        <div className="cp-field">
          <label>Title *</label>
          <input
            type="text"
            placeholder="Enter a short title"
            value={form.title}
            onChange={e =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        <div className="cp-field">
          <label>Description *</label>
          <textarea
            rows="5"
            placeholder="Write your message here..."
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <button
          className="cp-btn"
          disabled={!isValid}
        >
          Send Message
        </button>
      </form>

      {/* ---------- STYLES ---------- */}
      <style>{`
        .cp-wrapper {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 40px 16px;
          margin-top: 70px;
        }

        .cp-card {
          width: 100%;
          max-width: 520px;
          background: #fff;
          padding: 34px;
          border-radius: 18px;
          box-shadow: 0 20px 45px rgba(0,0,0,0.08);
        }

        .cp-card h2 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .cp-subtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .cp-field {
          margin-bottom: 18px;
        }

        .cp-field label {
          font-size: 13px;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }

        .cp-field input,
        .cp-field textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
        }

        .cp-field input:focus,
        .cp-field textarea:focus {
          border-color: #6d5cff;
        }

        .cp-btn {
          width: 100%;
          margin-top: 12px;
          background: #6d5cff;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .cp-btn:disabled {
          background: #c7c3ff;
          cursor: not-allowed;
        }

        .cp-btn:not(:disabled):hover {
          background: #5a4df5;
        }

        /* ALERTS */
        .cp-alert {
          max-width: 520px;
          margin: 120px auto;
          padding: 26px;
          border-radius: 16px;
          text-align: center;
          font-weight: 500;
        }

        .cp-alert.inline {
          margin: 0 0 16px;
          padding: 12px;
          font-size: 14px;
        }

        .cp-alert.warning {
          background: #fff7e6;
          color: #8a5a00;
        }

        .cp-alert.success {
          background: #e8fff1;
          color: #137333;
        }

        .cp-alert.error {
          background: #ffecec;
          color: #b00020;
        }
      `}</style>
    </section>
  );
}
