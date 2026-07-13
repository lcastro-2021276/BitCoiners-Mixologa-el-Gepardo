// DashboardPage.jsx
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/Auth/store/authStore.js";
import { DashboardContainer } from "../../shared/components/layout/DashboardContainer.jsx";

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =========================
  // VALIDAR SI ES ADMIN
  // =========================
  const isAdmin =
    user?.role === "Admin" ||
    user?.role === "ADMIN";

  // =========================
  // TITULO DINÁMICO
  // =========================
  const dashboardTitle = isAdmin
    ? "Hamburguesas y Mixología El Gepardo"
    : `Bienvenido ${user?.username || user?.name || "Cliente"}`;

  // =========================
  // SUBTITULO DINÁMICO
  // =========================
  const dashboardSubtitle = isAdmin
    ? `Administrador: ${user?.name || "Admin"}`
    : "Explora el menú, realiza pedidos y administra tus reservas";

  return (
    <DashboardContainer
      user={user}
      onLogout={handleLogout}
      title={dashboardTitle}
      subtitle={dashboardSubtitle}
    >
      <Outlet />
    </DashboardContainer>
  );
};