// src/app/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage }          from "../../features/auth/pages/AuthPage";
import { VerifyEmailPage }   from "../../features/auth/pages/VerifyEmailPage";
import { UnauthorizedPage }  from "../../features/auth/pages/UnauthorizedPage";
import { DashboardPage }     from "../layouts/DashboardPage";
import { DashboardHome }     from "../../features/dashboard/pages/DashboardHome";
import { ProtectedRoute }    from "./ProtectedRoute";
import { RoleGuard }         from "./RoleGuard";

export const AppRoutes = () => {
  return (
    <Routes>

      {/* ── PÚBLICAS ── */}
      <Route path="/login"          element={<AuthPage />} />
      <Route path="/verify-email"   element={<VerifyEmailPage />} />
      <Route path="/unauthorized"   element={<UnauthorizedPage />} />

      {/* ── PROTEGIDAS (requieren sesión) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />}>

          {/* Accesible por cualquier rol autenticado */}
          <Route path="/dashboard" element={<DashboardHome />} />

          {/* Solo Admin y Manager */}
          <Route element={<RoleGuard allowedRoles={["Admin", "Manager"]} />}>
            {/* <Route path="/dashboard/users"  element={<UsersPage />} /> */}
            {/* <Route path="/dashboard/reports" element={<ReportsPage />} /> */}
          </Route>

          {/* Solo Admin */}
          <Route element={<RoleGuard allowedRoles={["Admin"]} />}>
            {/* <Route path="/dashboard/settings" element={<SettingsPage />} /> */}
          </Route>

          {/* Todas las rutas del dashboard (cualquier rol) */}
          {/* <Route path="/dashboard/menu"          element={<MenuPage />} /> */}
          {/* <Route path="/dashboard/orders"        element={<OrdersPage />} /> */}
          {/* <Route path="/dashboard/reservations"  element={<ReservationsPage />} /> */}
          {/* <Route path="/dashboard/tables"        element={<TablesPage />} /> */}
          {/* <Route path="/dashboard/reviews"       element={<ReviewsPage />} /> */}

        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="/"  element={<Navigate to="/login" replace />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />

    </Routes>
  );
};