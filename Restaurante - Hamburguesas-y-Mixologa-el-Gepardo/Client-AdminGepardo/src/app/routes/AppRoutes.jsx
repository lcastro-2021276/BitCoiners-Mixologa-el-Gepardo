// src/app/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage }          from "../../features/auth/pages/AuthPage";
import { VerifyEmailPage }   from "../../features/auth/pages/VerifyEmailPage";
import { UnauthorizedPage }  from "../../features/auth/pages/UnauthorizedPage";
import { DashboardPage }     from "../layouts/DashboardPage";
import { DashboardHome }     from "../../features/dashboard/pages/DashboardHome";
import { ProtectedRoute }    from "./ProtectedRoute";
import { RoleGuard }         from "./RoleGuard";
import { MenuPage }          from "../../features/auth/pages/MenuPage";        // ← agregar
import { RestaurantsPage }   from "../../features/auth/pages/RestaurantsPage"; // ← agregar
import { TablesPage }        from "../../features/auth/pages/TablesPage";      // ← agregar

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login"         element={<AuthPage />} />
      <Route path="/verify-email"  element={<VerifyEmailPage />} />
      <Route path="/unauthorized"  element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />}>
          <Route path="/dashboard"             element={<DashboardHome />} />
          <Route path="/dashboard/menu"        element={<MenuPage />} />        {/* ← agregar */}
          <Route path="/dashboard/restaurants" element={<RestaurantsPage />} /> {/* ← agregar */}
          <Route path="/dashboard/tables"      element={<TablesPage />} />      {/* ← agregar */}
        </Route>
      </Route>

      <Route path="/"  element={<Navigate to="/login" replace />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />
    </Routes>
  );
};