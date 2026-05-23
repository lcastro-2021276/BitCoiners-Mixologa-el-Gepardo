import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";  //  faltaba esto

export const RoleGuard = ({ allowedRoles = [], children }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase();
  const hasRole = allowedRoles.includes(userRole);

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};