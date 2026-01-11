import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";
import ProfilePopup from "./ProfilePopup";
import "./ProfilePage.css";

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
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // ✅ Only allow update if cooldown is off
    if (cooldown) {
      setPopup({
        type: "warning",
        title: "Update Locked",
        text: `Next update in: ${countdown}`,
      });
      return;
    }

    setProfile({ ...profile, profile_image: file });
    setEdit(true);
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", profile.fullname || "");
      formData.append("mobile", profile.mobile || "");

      // ✅ Only append if File object exists
      if (profile.profile_image instanceof File) {
        formData.append("profile_image", profile.profile_image);
      }

      // 🔄 Wait for backend to respond before updating state
      const res = await updateProfile(formData);

      // ✅ Wait for updated profile from backend
      const updatedProfileRes = await getProfile();
      setProfile(updatedProfileRes.data);
      setEdit(false);

      setPopup({
        type: "success",
        title: "Success",
        text: "Profile updated successfully",
      });
    } catch (err) {
      setPopup({
        type: "warning",
        title: "Update Failed",
        text:
          err.response?.data?.detail ||
          err.message ||
          "Failed to update. Try again later.",
      });
    } finally {
      setLoading(false);
    }
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
        
      `}</style>
    </>
  );
};

export default Profile;
