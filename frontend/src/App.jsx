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
import ForgotPassword from "./form/ForgotPassword";
import Notification from "./pages/Notification";
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
import DeleteConfirmation from "./components/post/DeleteConfirmation";
import AuthErrorScreen from "./components/common/AuthErrorScreen";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import { LoadingProvider, useLoading } from "./components/common/LoadingContext";
import GlobalLoader from "./components/common/GlobalLoader";
import { setLoadingInterceptor } from "./api/axios";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    // Connect axios to our global loader
    setLoadingInterceptor(setLoading);

    const refresh = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!refresh);

    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.category);
    }
  }, [setLoading]);

  if (isLoggedIn === null) return <GlobalLoader forceShow />;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = "/";
  };

  return (
    <>
      <GlobalLoader />
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <Routes>
        <Route path="/" element={<HomePageHere isLoggedIn={isLoggedIn} />} />
        <Route path="/verify-otp" element={<OtpVerifyHere />} />
        <Route path="/review" element={<PrivateRoute> <CustomerReviews isLoggedIn={isLoggedIn} /> </PrivateRoute>} />
        <Route path="/templates/gallery" element={<TemplateGallery />} />
        <Route
          path="/templates/upload"
          element={
            <PrivateRoute>
              {(userRole === "designer" || userRole === "developer") ? (
                <UploadTemplate />
              ) : (
                <AuthErrorScreen
                  title="Permission Denied"
                  message="Only designers and developers can upload templates."
                />
              )}
            </PrivateRoute>
          }
        />
        <Route path="/template/:slug" element={<TemplateDetail />} />
        <Route
          path="/template/subscriptions"
          element={
            <PrivateRoute>
              <SubscribedTemplates />
            </PrivateRoute>
          }
        />
        <Route path="/creator/:publicId/templates" element={<CreatorTemplates />} />
        <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
        <Route path="/notification" element={<PrivateRoute> <Notification /> </PrivateRoute>} />
        <Route
          path="/template/:slug/edit"
          element={
            <PrivateRoute>
              {(userRole === "designer" || userRole === "developer") ? (
                <UploadTemplate edit />
              ) : (
                <AuthErrorScreen
                  title="Permission Denied"
                  message="Only the project owner can edit this."
                />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/my/templates"
          element={
            <PrivateRoute>
              <MyTemplates />
            </PrivateRoute>
          }
        />

        <Route path="/company" element={<AppCompany />} />
        <Route path="/contact-us" element={<PrivateRoute> <ContactUs /> </PrivateRoute>} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/template-view/:slug" element={<TemplateView />} />
        <Route
          path="/template/:slug/delete"
          element={
            <PrivateRoute>
              <DeleteConfirmation />
            </PrivateRoute>
          }
        />
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
              <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            isLoggedIn ? (
              <AuthErrorScreen
                title="Already Logged In"
                message="You are already logged in."
                actionText="Go to Profile"
                actionLink="/profile"
              />
            ) : (
              <ForgotPassword />
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

      <Footer isLoggedIn={isLoggedIn} userRole={userRole} />
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
