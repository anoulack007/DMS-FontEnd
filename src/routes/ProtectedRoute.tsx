import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { LOGIN_PATH, MANAGE_DOC_PATH } from "./paths";
import { UserRole } from "../enums/role";
import { PROJECT_MANAGER, USER, HR, ADMIN } from "./permission/permission";

// Enhanced Protected Route Component with Role-Based Access
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = useSelector((state: RootState) => state?.auth?.data);
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!authData) {
    return <Navigate to={LOGIN_PATH} replace />;
  }
  
  // Get user role from auth data
  const userRole = authData.role as UserRole;
  
  // Get current path
  const currentPath = location.pathname;
  
  // Function to check if the current path is allowed for the given role
  const isPathAllowedForRole = (path: string, role: UserRole): boolean => {
    // Handle detail pages with IDs
    if (path.includes('/')) {
      const basePath = '/' + path.split('/')[1];
      
      // Special handling for detail pages
      if (role === UserRole.ADMIN) {
        return true; // Admins can access all routes
      } else if (role === UserRole.PROJECT_MANAGER && PROJECT_MANAGER.some(route => route === basePath || basePath.startsWith(route))) {
        return true;
      } else if (role === UserRole.USER && USER.some(route => route === basePath || basePath.startsWith(route))) {
        return true;
      } else if (role === UserRole.HR && HR.some(route => route === basePath || basePath.startsWith(route))) {
        return true;
      }
      return false;
    }
    
    // Check if the path is allowed for the user's role
    switch (role) {
      case UserRole.ADMIN:
        return ADMIN.includes(path);
      case UserRole.PROJECT_MANAGER:
        return PROJECT_MANAGER.includes(path);
      case UserRole.USER:
        return USER.includes(path);
      case UserRole.HR:
        return HR.includes(path);
      default:
        return false;
    }
  };
  
  // Check if the current path is allowed for the user's role
  if (!isPathAllowedForRole(currentPath, userRole)) {
    // Redirect to a default allowed page based on role
    return <Navigate to={MANAGE_DOC_PATH} replace />;
  }
  
  // If authenticated and authorized, render the children
  return <>{children}</>;
};