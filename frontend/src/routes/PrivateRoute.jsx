import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
