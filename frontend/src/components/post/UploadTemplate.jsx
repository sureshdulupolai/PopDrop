import { useState, useEffect } from "react";
import privateApi from "../../api/axiosPrivate";

const UploadTemplate = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    code_content: "",
  });

  const [desktop, setDesktop] = useState(null);
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    privateApi.get("/pop/categories/").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("desktop_image", desktop);
    fd.append("mobile_image", mobile);

    try {
      setLoading(true);
      await privateApi.post("/pop/upload/", fd);

      // ✅ SUCCESS
      setSuccessMsg("🎉 Template uploaded successfully! Waiting for admin approval.");

      // reset form
      setForm({ title: "", description: "", category: "", code_content: "" });
      setDesktop(null);
      setMobile(null);
    } catch (err) {
      alert("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-wrapper">
      <div className="upload-box">
        <h2 className="upload-title">✨ Upload New Template</h2>
        <p className="upload-subtitle">
          Share your UI template with the community
        </p>

        {/* ✅ SUCCESS CARD */}
        {successMsg && (
          <div className="success-box">
            <h4>✅ Upload Successful</h4>
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={submitForm} className="upload-form">
          <div className="upload-grid">
            <div>
              <label>Template Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Category</label>
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
          </div>

          <label>Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label>Code (HTML / CSS / JS)</label>
          <textarea
            rows="6"
            value={form.code_content}
            onChange={(e) =>
              setForm({ ...form, code_content: e.target.value })
            }
          />

          <div className="upload-file-grid">
            <div>
              <span>Desktop Preview</span>
              <input
                type="file"
                onChange={(e) => setDesktop(e.target.files[0])}
              />
            </div>

            <div>
              <span>Mobile Preview</span>
              <input
                type="file"
                onChange={(e) => setMobile(e.target.files[0])}
              />
            </div>
          </div>

          <button className="upload-submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "🚀 Publish Template"}
          </button>
        </form>
      </div>

      {/* ===== STYLES ===== */}
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

        .upload-form label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
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
