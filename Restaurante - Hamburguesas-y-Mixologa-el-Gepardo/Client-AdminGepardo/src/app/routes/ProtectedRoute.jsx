import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/Auth/store/authStore.js";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  // Leer estado fresco directamente del store
  const state = useAuthStore.getState();

  if (!state.isAuthenticated || !state.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};