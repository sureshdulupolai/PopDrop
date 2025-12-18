import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const refresh = localStorage.getItem("refresh_token");

  return refresh ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
