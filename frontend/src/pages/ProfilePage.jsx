import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Welcome, {JSON.parse(localStorage.getItem("user")).fullname}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
