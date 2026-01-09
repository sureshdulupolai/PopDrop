import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import InfoCard from "./cardAlert";
import "./formCP.css";

export default function JoinTeam() {
  const navigate = useNavigate();

  const [techs, setTechs] = useState([]);
  const [info, setInfo] = useState(null);
  const [infoType, setInfoType] = useState("warning");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    using_popdrop_since: "",
    experience_years: "",
    tech_stack: [],
    resume: null,
  });

  /* ---------- VALIDATION ---------- */
  const isFormValid =
    form.using_popdrop_since !== "" &&
    form.experience_years !== "" &&
    form.tech_stack.length > 0 &&
    form.resume;

  /* ---------- FETCH TECH ---------- */
  useEffect(() => {
    api.get("/team/apply/")
      .then(res => {
        if (res.data.already_applied) {
          setInfo(res.data.message || "You have already applied.");
          setInfoType("warning");
        } else if (res.data.no_category) {
          setInfo("No open roles available right now.");
          setInfoType("error");
        } else {
          setTechs(res.data.techs);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- HELPERS ---------- */
  const handlePositive = (field, value) => {
    if (value < 0) return;
    setInfo(null);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleTech = (id) => {
    setInfo(null);
    setForm(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(id)
        ? prev.tech_stack.filter(i => i !== id)
        : [...prev.tech_stack, id]
    }));
  };

  /* ---------- SUBMIT ---------- */
  const submit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setInfo("⚠️ Please fill all required fields before submitting.");
      setInfoType("warning");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(i => fd.append(k, i));
      } else {
        fd.append(k, v);
      }
    });

    try {
      await api.post("/team/apply/", fd);
      setInfo("🎉 Application submitted successfully!");
      setInfoType("success");
    } catch (err) {
      setInfo(err.response?.data?.detail || "Something went wrong");
      setInfoType("error");
    }
  };

  /* ---------- STATES ---------- */
  if (loading) return <div className="cpm-loading">Loading…</div>;

  if (info && infoType !== "success") {
    return <InfoCard type={infoType} message={info} />;
  }

  /* ---------- UI ---------- */
  return (
    <section className="cpm-join-wrapper">
      <form className="cpm-form" onSubmit={submit}>
        <h2 className="cpm-title">Join Our Team</h2>
        <p className="cpm-subtitle">
          Share your experience & skills with us
        </p>

        <div className="cpm-field">
          <label>Using PopDrop since (months) *</label>
          <input
            type="number"
            min="0"
            value={form.using_popdrop_since}
            onChange={e =>
              handlePositive("using_popdrop_since", e.target.value)
            }
          />
        </div>

        <div className="cpm-field">
          <label>Total experience (years) *</label>
          <input
            type="number"
            min="0"
            value={form.experience_years}
            onChange={e =>
              handlePositive("experience_years", e.target.value)
            }
          />
        </div>

        <div className="cpm-field">
          <label>Select your tech stack *</label>

          <div className="cpm-tech-grid">
            {techs.map(t => (
              <div
                key={t.id}
                className={`cpm-tech-card ${
                  form.tech_stack.includes(t.id) ? "active" : ""
                }`}
                onClick={() => toggleTech(t.id)}
              >
                <span>{t.name}</span>
                <i className="bi bi-check-circle-fill" />
              </div>
            ))}
          </div>
        </div>

        <div className="cpm-field">
          <label>Upload Resume *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={e =>
              setForm({ ...form, resume: e.target.files[0] })
            }
          />
        </div>

        <div className="cpm-actions">
            <button
                type="submit"
                className="cpm-btn-primary"
                disabled={!isFormValid}
                >
                Apply for Team
            </button>

            <button
                type="button"
                className="cpm-btn-secondary"
                onClick={() => navigate(-1)}
                >
                Cancel
            </button>

        </div>
      </form>
    </section>
  );
}
