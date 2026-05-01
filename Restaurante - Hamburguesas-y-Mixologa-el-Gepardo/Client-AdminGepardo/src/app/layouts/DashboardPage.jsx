import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import { DashboardContainer } from "../../shared/components/layout/DashboardContainer.jsx";

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <DashboardContainer
      user={user}
      onLogout={logout}
      title="Hamburguesas y Mixología el Gepardo"
      subtitle={`Bienvenido, ${user?.name || "Administrador"}`}
    >
      <Outlet />
    </DashboardContainer>
  );
};