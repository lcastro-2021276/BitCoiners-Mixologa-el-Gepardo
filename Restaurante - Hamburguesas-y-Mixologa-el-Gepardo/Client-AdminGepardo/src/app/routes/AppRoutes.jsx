 // src/app/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/Auth/pages/AuthPage";
import { VerifyEmailPage } from "../../features/Auth/pages/VerifyEmailPage";
import { UnauthorizedPage } from "../../features/Auth/pages/UnauthorizedPage";
import { DashboardPage } from "../layouts/DashboardPage";
import { DashboardHome } from "../../features/dashboard/pages/DashboardHome";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { MenuPage } from "../../features/Auth/pages/MenuPage";
import { RestaurantsPage } from "../../features/Auth/pages/RestaurantsPage";
import { TablesPage } from "../../features/Auth/pages/TablesPage";
import { OrdersPage } from "../../features/Auth/pages/OrdersPage";
import { UsersPage } from "../../features/Auth/pages/UsersPage";
import { ReservationsPage } from "../../features/Auth/pages/ReservationsPage";
import { ReviewsPage } from "../../features/Auth/pages/ReviewsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/menu" element={<MenuPage />} />
          <Route path="/dashboard/restaurants" element={<RestaurantsPage />} />
          <Route path="/dashboard/tables" element={<TablesPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />

          <Route
            path="/dashboard/users"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UsersPage />
              </RoleGuard>
            }
          />

          <Route path="/dashboard/reviews" element={<ReviewsPage />} />
          <Route
            path="/dashboard/reservations"
            element={<ReservationsPage />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};