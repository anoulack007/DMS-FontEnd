import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { LOGIN_PATH } from "./paths";

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = useSelector((state: RootState) => state?.auth?.data);
  
  if (!authData) {
    return <Navigate to={LOGIN_PATH} replace />;
  }
  
  return <>{children}</>;
};

