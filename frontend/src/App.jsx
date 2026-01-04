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
import TemplateGallery from "./components/post/TemplateGallery";
import UploadTemplate from "./components/post/UploadTemplate";
import TemplateDetail from "./components/post/TemplateDetail";
import SubscribedTemplates from "./components/post/SubscribedTemplates";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const refresh = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!refresh);

    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.category);
    }
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = "/";
  };

  return (
    <>
      {/* ✅ YAHI MAIN FIX */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <Routes>
        <Route path="/" element={<HomePageHere isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Signup role="normal" />} />
        <Route path="/signup/designer" element={<Signup role="designer" />} />
        <Route path="/signup/developer" element={<Signup role="developer" />} />

        <Route path="/verify-otp" element={<OtpVerifyHere />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/review" element={<CustomerReviews isLoggedIn={isLoggedIn} />} />
        <Route path="/templates/gallery" element={<TemplateGallery />} />
        <Route path="/templates/upload" element={<UploadTemplate />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route path="/template/subscriptions" element={<SubscribedTemplates />} />

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
