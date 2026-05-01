// src/shared/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  HomeIcon, ClipboardDocumentListIcon, UsersIcon,
  CalendarDaysIcon, StarIcon, TableCellsIcon,
  Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const NAV_SECTIONS = [
  {
    label: "Principal",
    items: [
      { to: "/dashboard",              label: "Inicio",        icon: HomeIcon },
      { to: "/dashboard/orders",       label: "Pedidos",       icon: ClipboardDocumentListIcon, badge: "12" },
      { to: "/dashboard/menu",         label: "Menú",          icon: Bars3Icon },
      { to: "/dashboard/reservations", label: "Reservaciones", icon: CalendarDaysIcon, badgeInfo: "3" },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { to: "/dashboard/tables",  label: "Mesas",    icon: TableCellsIcon },
      { to: "/dashboard/users",   label: "Usuarios", icon: UsersIcon },
      { to: "/dashboard/reviews", label: "Reseñas",  icon: StarIcon },
    ],
  },
];

export const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-30 h-full w-60 flex flex-col
        transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{
        background: "var(--bg-primary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* BRAND */}
      <div
        className="px-4 py-5"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                El Gepardo
              </p>
              <p
                className="font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-accent)", fontSize: "9px" }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          {/* Cerrar en mobile */}
          <button
            className="lg:hidden"
            onClick={onClose}
            style={{ color: "var(--text-muted)" }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label}>

            {/* Section label */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <span
                className="font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)", fontSize: "9px" }}
              >
                {label}
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border-color)" }}
              />
            </div>

            {/* Items */}
            {items.map(({ to, label: lbl, icon: Icon, badge, badgeInfo }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-0.5
                  ${isActive ? "" : "hover:opacity-80"}`
                }
                style={({ isActive }) => ({
                  background: isActive ? "rgba(183,109,27,0.15)" : "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                  borderLeft: isActive
                    ? "3px solid var(--color-accent)"
                    : "3px solid transparent",
                })}
                onClick={onClose}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{lbl}</span>

                {badge && (
                  <span
                    className="font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-accent)",
                      color: "#fff",
                      fontSize: "10px",
                    }}
                  >
                    {badge}
                  </span>
                )}
                {badgeInfo && (
                  <span
                    className="font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(56,189,248,0.15)",
                      color: "#38bdf8",
                      fontSize: "10px",
                    }}
                  >
                    {badgeInfo}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER USER */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden flex-1">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name || "Administrador"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {user?.email || "Super Admin"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition hover:opacity-80"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            title="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon
              className="w-4 h-4"
              style={{ color: "var(--color-error)" }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};