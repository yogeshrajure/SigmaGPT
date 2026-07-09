import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("Loading:", loading);
  console.log("User:", user);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;