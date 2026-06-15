import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Pages/Auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStateContext();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;