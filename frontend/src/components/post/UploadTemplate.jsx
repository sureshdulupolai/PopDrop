import { useState, useEffect } from "react";
import privateApi from "../../api/axiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import AuthErrorScreen from "../common/AuthErrorScreen";

const UploadTemplate = ({ edit = false }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [forbidden, setForbidden] = useState(false); // ✅ NEW

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    code_content: "",
  });

  const [desktop, setDesktop] = useState(null);
  const [mobile, setMobile] = useState(null);

  const [existingDesktop, setExistingDesktop] = useState(null);
  const [existingMobile, setExistingMobile] = useState(null);

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    if (!localStorage.getItem("refresh_token")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* 📦 CATEGORIES */
  useEffect(() => {
    privateApi.get("/pop/categories/").then((res) => {
      setCategories(res.data);
    });
  }, []);

  /* ✏️ EDIT MODE DATA (OWNER CHECK VIA BACKEND) */
  useEffect(() => {
    if (edit && slug) {
      privateApi
        .get(`/pop/posts/${slug}/`)
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            description: data.description || "",
            category: String(data.category?.id),
            code_content: data.code_content || "",
          });

          setExistingDesktop(data.desktop_image || null);
          setExistingMobile(data.mobile_image || null);
        })
        .catch(() => {
          // ❌ not owner OR slug invalid
          setForbidden(true);
        });
    }
  }, [edit, slug]);

  const submitForm = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    if (desktop) fd.append("desktop_image", desktop);
    if (mobile) fd.append("mobile_image", mobile);

    try {
      setLoading(true);

      if (edit) {
        await privateApi.put(`/pop/posts/${slug}/update/`, fd);
        navigate(`/template/${slug}`);
      } else {
        await privateApi.post("/pop/upload/", fd);
        setSuccessMsg("🎉 Template uploaded successfully!");
        setForm({
          title: "",
          description: "",
          category: "",
          code_content: "",
        });
        setDesktop(null);
        setMobile(null);
      }
    } catch {
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* 🚫 NOT OWNER / INVALID EDIT ACCESS */
  if (forbidden) {
    return (
      <AuthErrorScreen
        title="Access denied"
        message="You are not allowed to edit this template."
        actionText="Go to Gallery"
        actionLink="/templates/gallery"
      />
    );
  }

  return (
    <div className="upload-page-wrapper">
      <div className="upload-box">
        <h2 className="upload-title">
          {edit ? "✏️ Edit Template" : "✨ Upload New Template"}
        </h2>

        <p className="upload-subtitle">
          {edit
            ? "Update your template details"
            : "Share your UI template with the community"}
        </p>

        {successMsg && <div className="success-box">{successMsg}</div>}

        <form onSubmit={submitForm} className="upload-form">
          <div className="upload-grid">
            <input
              placeholder="Template Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows="4"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <textarea
            rows="6"
            placeholder="Code (HTML / CSS / JS)"
            value={form.code_content}
            onChange={(e) =>
              setForm({ ...form, code_content: e.target.value })
            }
          />

          {/* ✅ EXISTING IMAGES (EDIT MODE) */}
          {edit && (
            <div style={{ marginBottom: "10px" }}>
              {existingDesktop && (
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  🖥 Desktop image:{" "}
                  <a href={existingDesktop} target="_blank" rel="noreferrer">
                    view
                  </a>
                </p>
              )}
              {existingMobile && (
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  📱 Mobile image:{" "}
                  <a href={existingMobile} target="_blank" rel="noreferrer">
                    view
                  </a>
                </p>
              )}
            </div>
          )}

          <div className="upload-file-grid">
            <input type="file" onChange={(e) => setDesktop(e.target.files[0])} />
            <input type="file" onChange={(e) => setMobile(e.target.files[0])} />
          </div>

          <button className="upload-submit-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : edit
              ? "✅ Update Template"
              : "🚀 Publish Template"}
          </button>
        </form>
      </div>

      {/* ===== STYLES (UNCHANGED) ===== */}
      <style>{`
        .upload-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc, #eef2ff);
          padding: 90px 20px;
          display: flex;
          justify-content: center;
        }

        .upload-box {
          width: 100%;
          max-width: 850px;
          background: #ffffff;
          border-radius: 22px;
          padding: 40px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.08);
        }

        .upload-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
        }

        .upload-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .success-box {
          background: #ecfdf5;
          border: 1px solid #10b981;
          color: #065f46;
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }

        .upload-form input,
        .upload-form textarea,
        .upload-form select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          margin-bottom: 16px;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .upload-file-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .upload-submit-btn {
          width: 100%;
          margin-top: 25px;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          font-size: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }

        .upload-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
        }

        @media (max-width: 768px) {
          .upload-grid,
          .upload-file-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadTemplate;
