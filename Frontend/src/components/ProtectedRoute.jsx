// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if(location.pathname=="/"){
    return children;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;