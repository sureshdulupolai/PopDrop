import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePageHere from "./components/Home/HomePath";
import Footer from "./components/Navbar/Footer";
import Signup from "./form/Signup";
import OtpVerifyHere from "./form/OtpVerify";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./form/Login";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePageHere />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerifyHere />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
