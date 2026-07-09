import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CalendarDaysIcon,
  StarIcon,
  TableCellsIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  QueueListIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  const isClient = user?.role === "Cliente" || user?.role === "CLIENT";

  const NAV_SECTIONS = [
    {
      label: "Principal",
      items: [
        { to: "/dashboard",              label: "Inicio",       icon: HomeIcon,                    },
        { to: "/dashboard/orders",       label: "Pedidos",      icon: ClipboardDocumentListIcon, badge: "12" },
        { to: "/dashboard/menu",         label: "Menú",         icon: QueueListIcon,               },
        { to: "/dashboard/reservations", label: "Reservas",     icon: CalendarDaysIcon, badgeInfo: "3" },
      ],
    },
    {
      label: isClient ? "Explorar" : "Administración",
      items: [
        { to: "/dashboard/restaurants", label: "Restaurantes", icon: BuildingStorefrontIcon },
        { to: "/dashboard/tables",      label: "Mesas",        icon: TableCellsIcon        },
        ...(!isClient ? [{ to: "/dashboard/users", label: "Usuarios", icon: UsersIcon }] : []),
        { to: "/dashboard/reviews",     label: "Reseñas",      icon: StarIcon              },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40
        flex h-screen w-[300px] flex-col
        overflow-hidden
        border-r border-amber-500/15
        bg-gradient-to-b from-[#0d1b14] via-[#1a2e23] to-[#0d1b14]
        shadow-2xl shadow-black/30
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        relative
      `}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/3 via-amber-400/5 to-amber-500/3 animate-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyMHptNDAgMEwwIDQwVjIwTDIwIDQweiIgZmlsbD0iI0M5OTcyQSIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-15 pointer-events-none" />

      {/* BRAND */}
      <div className="relative border-b border-amber-500/15 px-5 py-5 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-400/8 to-amber-500/5 animate-pulse" />

        {/* Decorative glow effect */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-amber-500/12 rounded-full blur-2xl animate-pulse" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated icon container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-lg opacity-40 animate-pulse group-hover:opacity-50 transition-opacity" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl shadow-amber-500/30 ring-2 ring-amber-400/25 group-hover:scale-110 group-hover:shadow-amber-500/40 transition-all duration-300">
                <SparklesIcon className="h-5.5 w-5.5 text-[#0d1b14] animate-spin-slow" />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/25 animate-bounce">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-white leading-tight">
                El Gepardo
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-px w-4 bg-gradient-to-r from-amber-400/40 to-transparent" />
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-amber-400/70">
                  {isClient ? "Portal Cliente" : "Panel de Control"}
                </p>
                <div className="h-px w-4 bg-gradient-to-r from-transparent to-amber-400/40" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative rounded-xl p-2 text-zinc-400 transition-all duration-300 hover:bg-amber-400/15 hover:text-amber-300 lg:hidden hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="h-4.5 w-4.5" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-400/8 to-amber-500/0 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <div className="mb-3 px-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/60">
                  {label}
                </span>
              </div>

              <div className="space-y-2">
                {items.map(({ to, label: lbl, icon: Icon, badge, badgeInfo }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/dashboard"}
                    onClick={onClose}
                    className={({ isActive }) => `
                      group relative flex items-center gap-4
                      rounded-xl px-4 py-3.5
                      text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? "bg-gradient-to-r from-amber-500/12 to-amber-400/6 text-amber-300 border border-amber-500/25 shadow-lg shadow-amber-500/10"
                        : "text-zinc-400 hover:bg-amber-900/20 hover:text-white hover:scale-[1.02]"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 shrink-0 ${
                          isActive
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d1b14] shadow-lg shadow-amber-500/25"
                            : "bg-amber-900/30 text-amber-400/70 group-hover:bg-amber-900/45 group-hover:text-amber-300 group-hover:shadow-lg group-hover:shadow-amber-500/15"
                        }`}>
                          <Icon className="h-5 w-5" />
                          {isActive && (
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/0 via-amber-400/15 to-amber-500/0 animate-pulse" />
                          )}
                        </div>

                        <span className="flex-1 truncate">{lbl}</span>

                        {badge && (
                          <span className="rounded-full bg-gradient-to-br from-amber-400 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-[#0d1b14] shadow-md">
                            {badge}
                          </span>
                        )}
                        {badgeInfo && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300/90">
                            {badgeInfo}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="relative border-t border-amber-500/15 p-4">
        <div className="relative flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-amber-900/15 p-4 transition-all duration-300 hover:border-amber-400/30 hover:bg-gradient-to-br hover:from-amber-950/40 hover:to-amber-900/20 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02] group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-400/8 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-[#0d1b14] shrink-0 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/20 group-hover:scale-110 group-hover:shadow-amber-500/35 transition-all duration-300">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="relative min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">
              {isClient ? user?.username || user?.name || "Cliente" : user?.name || "Administrador"}
            </p>
            <p className="truncate text-[11px] text-amber-400/60">
              {user?.email || "admin@gepardo.com"}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/12 text-red-400 transition-all duration-300 hover:bg-red-500/18 hover:border-red-400/25 hover:shadow-lg hover:shadow-red-500/15 shrink-0 hover:scale-110"
          >
            <ArrowRightOnRectangleIcon className="h-4.5 w-4.5" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-400/8 to-red-500/0 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </aside>
  );
};