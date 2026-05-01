// src/app/routes/RoleGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";

/**
 * Protege rutas por rol.
 * Uso: <Route element={<RoleGuard allowedRoles={["Admin", "Manager"]} />}>
 */
export const RoleGuard = ({ allowedRoles = [] }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};