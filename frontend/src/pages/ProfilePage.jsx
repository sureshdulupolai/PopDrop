import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";
import ProfilePopup from "./ProfilePopup";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      setPopup({
        type: "warning",
        title: "Session Issue",
        text: "Please refresh the page or login again if problem persists.",
      });
    }
  };

  // ---------------- COUNTDOWN ----------------
  useEffect(() => {
    const timer = setInterval(() => {
      if (profile?.next_profile_update_allowed_at) {
        const now = new Date();
        const next = new Date(profile.next_profile_update_allowed_at);
        const diff = next - now;

        if (diff > 0) {
          const hrs = Math.floor(diff / 1000 / 3600);
          const mins = Math.floor((diff / 1000 % 3600) / 60);
          const secs = Math.floor(diff / 1000 % 60);
          setCountdown(`${hrs}h ${mins}m ${secs}s`);
          setCooldown(true);
        } else {
          setCountdown("");
          setCooldown(false);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [profile]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const fieldName = e.target.name;

    if (cooldown) {
      setPopup({
        type: "warning",
        title: "Update Locked",
        text: `Next update in: ${countdown}`,
      });
      return;
    }

    setProfile({ ...profile, [fieldName]: e.target.value });
    setEdit(true);
  };

  // ---------------- HANDLE IMAGE CLICK ----------------
  const handleImageClick = () => {
    if (cooldown) {
      setPopup({
        type: "warning",
        title: "Update Locked",
        text: `Next update in: ${countdown}`,
      });
      return true; // block file input
    }
    return false;
  };

  const handleImage = (e) => {
    // Image click already checked cooldown
    if (e.target.files && e.target.files.length > 0) {
      setProfile({ ...profile, profile_image: e.target.files[0] });
      setEdit(true);
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", profile.fullname || "");
      formData.append("mobile", profile.mobile || "");
      if (profile.profile_image instanceof File)
        formData.append("profile_image", profile.profile_image);

      await updateProfile(formData);

      setEdit(false);
      const updatedProfile = await getProfile();
      setProfile(updatedProfile.data);

      setPopup({
        type: "success",
        title: "Success",
        text: "Profile updated successfully",
      });
    } catch (err) {
      setPopup({
        type: "warning",
        title: "Update Failed",
        text: err.response?.data?.detail || "Try later",
      });
    }
    setLoading(false);
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <>
      <div className="profile-page">
        <div className="profile-card">
          <div className="rainbow-border"></div>

          {profile.is_blocked && (
            <div className="blocked-message">
              Your profile is blocked. Please contact admin.
            </div>
          )}

          <div className="profile-avatar">
            <img
              src={
                profile.profile_image instanceof File
                  ? URL.createObjectURL(profile.profile_image)
                  : profile.profile_image
                  ? profile.profile_image.startsWith("http")
                    ? profile.profile_image
                    : `http://localhost:8000${profile.profile_image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="profile-image"
            />
            {!profile.is_blocked && (
              <label className="avatar-edit">
                <input
                  type="file"
                  hidden
                  onClick={(e) => handleImageClick() && e.preventDefault()}
                  onChange={handleImage}
                />
                ✎
              </label>
            )}
          </div>

          <div className="verified-badge">
            {profile.is_verified ? "✔ Verified" : "❌ Not Verified"}
          </div>

          {/* Full Name */}
          <div className="field">
            <label>Full Name</label>
            <input
              name="fullname"
              value={profile.fullname || ""}
              placeholder="Enter your full name"
              onChange={handleChange}
              onClick={() => {
                if (cooldown) {
                  setPopup({
                    type: "warning",
                    title: "Update Locked",
                    text: `Next update in: ${countdown}`,
                  });
                }
              }}
            />
          </div>

          {/* Email (locked) */}
          <div className="field">
            <label>Email</label>
            <input
              value={profile.email || ""}
              disabled
              placeholder="Email cannot be changed"
              onClick={() =>
                setPopup({
                  type: "warning",
                  title: "Email Locked",
                  text: "Email cannot be changed",
                })
              }
            />
          </div>

          {/* Mobile */}
          <div className="field">
            <label>Mobile</label>
            <input
              name="mobile"
              value={profile.mobile || ""}
              placeholder="Enter mobile number"
              onChange={handleChange}
              onClick={() => {
                if (cooldown) {
                  setPopup({
                    type: "warning",
                    title: "Update Locked",
                    text: `Next update in: ${countdown}`,
                  });
                }
              }}
            />
          </div>

          {cooldown && !profile.is_blocked && (
            <div className="cooldown">Next update in: {countdown}</div>
          )}

          {edit && !cooldown && !profile.is_blocked && (
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        {popup && (
          <ProfilePopup
            type={popup.type}
            title={popup.title}
            text={popup.text}
            onClose={() => setPopup(null)}
          />
        )}
      </div>

      <style>{`
        .profile-page {
          min-height: 105vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f6fa;
        }
        .profile-card {
          position: relative;
          width: 420px;
          background: #fff;
          border-radius: 26px;
          padding: 36px 34px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,.12);
          overflow: hidden;
        }
        .rainbow-border {
          position: absolute;
          inset: 0;
          padding: 4px;
          border-radius: 26px;
          background: linear-gradient(45deg, #ff6ec4, #7873f5, #4ade80, #facc15);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
                  mask-composite: exclude; 
          pointer-events: none;
        }
        .profile-avatar {
          position: relative;
          width: 110px;
          height: 110px;
          margin: 0 auto;
          z-index: 1;
        }
        .profile-avatar img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #111;
        }
        .avatar-edit {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 32px;
          height: 32px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
        }
        .verified-badge {
          margin: 14px auto 26px;
          display: inline-block;
          padding: 7px 18px;
          border-radius: 20px;
          font-size: 13px;
          background: ${profile.is_verified ? "#e9fff4" : "#ffe9e9"};
          color: ${profile.is_verified ? "#0d8f57" : "#d32f2f"};
          font-weight: 500;
        }
        .field {
          text-align: left;
          margin-bottom: 22px;
        }
        .field label {
          font-size: 12px;
          color: #888;
        }
        .field input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #e5e5e5;
          padding: 6px 2px;
          font-size: 15px;
          outline: none;
          background: transparent;
          cursor: text;
        }
        .cooldown {
          font-size: 13px;
          color: #d35400;
          margin-top: 10px;
        }
        .save-btn {
          margin-top: 26px;
          width: 100%;
          padding: 13px;
          border-radius: 30px;
          font-size: 15px;
          border: 1.5px solid #f65b3b;
          background: transparent;
          color: #f65b3b;
          font-weight: 500;
          cursor: pointer;
          transition: .25s;
        }
        .save-btn:hover {
          background: #f65b3b;
          color: #fff;
        }
        .blocked-message {
          background: #ffebee;
          color: #c62828;
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default Profile;
