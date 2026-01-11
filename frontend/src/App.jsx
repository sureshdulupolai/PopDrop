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
import CreatorTemplates from "./components/post/CreatorTemplates";
import MyTemplates from "./components/post/MyTemplates";
import AppCompany from "./components/Company/pathCompany";
import JoinTeam from "./components/Company/formCP";
import ContactUs from "./pages/ContactUs";
import TemplateView from "./components/post/TemplateView";
import AuthErrorScreen from "./components/common/AuthErrorScreen";

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
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <Routes>
        <Route path="/" element={<HomePageHere isLoggedIn={isLoggedIn} />} />
        <Route path="/verify-otp" element={<OtpVerifyHere />} />
        <Route path="/review" element={<CustomerReviews isLoggedIn={isLoggedIn} />} />
        <Route path="/templates/gallery" element={<TemplateGallery />} />
        <Route path="/templates/upload" element={<UploadTemplate />} />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route path="/template/subscriptions" element={<SubscribedTemplates />} />
        <Route path="/creator/:publicId/templates" element={<CreatorTemplates />} />
        <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
        <Route path="/template/:slug/edit" element={<UploadTemplate edit />} />
        <Route path="/my/templates" element={<MyTemplates />} />

        <Route path="/company" element={<AppCompany />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/template-view/:slug" element={<TemplateView />} />
        <Route
            path="/join-team"
            element={
              <PrivateRoute>
                <JoinTeam />
              </PrivateRoute>
            }
          />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <AuthErrorScreen
                title="Already Logged In"
                message="You are already logged in. Please logout to create a new account."
                actionText="Go to Profile"
                actionLink="/profile"
                secondaryActionText="Go Home"
                secondaryActionLink="/"
              />
            ) : (
              <Signup role="normal" />
            )
          }
        />

        <Route
          path="/signup/designer"
          element={
            isLoggedIn ? (
              <AuthErrorScreen
                title="Access Denied"
                message="You are already logged in as a user. Logout to signup as designer."
                actionText="Logout & Signup"
                actionLink="/profile"
              />
            ) : (
              <Signup role="designer" />
            )
          }
        />

        <Route
          path="/signup/developer"
          element={
            isLoggedIn ? (
              <AuthErrorScreen
                title="Access Denied"
                message="You are already logged in. Developer signup requires logout."
                actionText="Go to Profile"
                actionLink="/profile"
              />
            ) : (
              <Signup role="developer" />
            )
          }
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <AuthErrorScreen
                title="Already Logged In"
                message="You are already logged in. Logout to login with another account."
                actionText="Go to Profile"
                actionLink="/profile"
                secondaryActionText="Go Home"
                secondaryActionLink="/"
              />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="*"
          element={
            <AuthErrorScreen
              title="Page Not Found"
              message={
                <>
                  The page <strong>{window.location.pathname}</strong> does not exist.
                </>
              }
              actionText="Go Home"
              actionLink="/"
              secondaryActionText="Browse Templates"
              secondaryActionLink="/templates/gallery"
            />
          }
        />



      </Routes>

      <Footer />
    </>
  );
}

export default App;
