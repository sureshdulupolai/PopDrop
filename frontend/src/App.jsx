import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import HomePageHere from "./components/Home/HomePath";
import Footer from "./components/Navbar/Footer";
import Signup from "./form/Signup";
import OtpVerifyHere from "./form/OtpVerify";
import Profile from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./form/Login";
import CustomerReviews from "./pages/ReviewPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const refresh = localStorage.getItem("refresh_token");
    setIsLoggedIn(!!refresh);
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<HomePageHere isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerifyHere />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/review" element={<CustomerReviews isLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
