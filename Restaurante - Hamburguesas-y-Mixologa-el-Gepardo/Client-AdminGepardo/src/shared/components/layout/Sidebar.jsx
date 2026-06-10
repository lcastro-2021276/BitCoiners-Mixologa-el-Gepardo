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
        border-r border-amber-900/20
        bg-gradient-to-b from-[#0d1b14] via-[#0f1f16] to-[#0d1b14]
        shadow-2xl shadow-black/40
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_50%)] pointer-events-none" />

      {/* BRAND */}
      <div className="relative border-b border-amber-900/20 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl shadow-amber-500/40 shrink-0 ring-2 ring-amber-400/30 relative">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#0d1b14]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5 5.2 3.5 6 3 7.5C2.5 9 3 10.5 4 11.5C3.5 12.5 3.5 13.8 4.2 14.8C3.8 15.8 4 17 4.8 17.8C5 19.5 6.5 21 8.5 21.5C9.5 22 10.7 22 12 22C13.3 22 14.5 22 15.5 21.5C17.5 21 19 19.5 19.2 17.8C20 17 20.2 15.8 19.8 14.8C20.5 13.8 20.5 12.5 20 11.5C21 10.5 21.5 9 21 7.5C20.5 6 19 5.2 17.5 5.5C16.5 3.5 14.5 2 12 2ZM10 9.5C10 9 10.4 8.5 11 8.5C11.6 8.5 12 9 12 9.5C12 10 11.6 10.5 11 10.5C10.4 10.5 10 10 10 9.5ZM13 9.5C13 9 13.4 8.5 14 8.5C14.6 8.5 15 9 15 9.5C15 10 14.6 10.5 14 10.5C13.4 10.5 13 10 13 9.5ZM12 16C10.5 16 9.3 15.1 9 13.8C9.8 14.1 10.8 14.3 12 14.3C13.2 14.3 14.2 14.1 15 13.8C14.7 15.1 13.5 16 12 16Z"/>
              </svg>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#FFD700] absolute -top-1 -right-1 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L9 6H3L6 10L4 16L12 13L20 16L18 10L21 6H15L12 1Z"/>
              </svg>
            </div>

            <div>
              <h2 className="text-[16px] font-bold tracking-tight text-white leading-tight">
                El Gepardo
              </h2>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-400/70 mt-1">
                {isClient ? "Portal Cliente" : "Panel de Control"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2.5 text-zinc-400 transition-all duration-300 hover:bg-amber-400/10 hover:text-amber-300 lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-10">
          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <div className="mb-4 flex items-center gap-3 px-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/50">
                  {label}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-900/30 to-transparent" />
              </div>

              <div className="space-y-1.5">
                {items.map(({ to, label: lbl, icon: Icon, badge, badgeInfo }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/dashboard"}
                    onClick={onClose}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3
                      overflow-hidden
                      rounded-2xl px-4 py-3
                      text-sm font-medium
                      transition-all duration-300
                      ${isActive
                        ? "bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent text-amber-300 border border-amber-400/30 shadow-lg shadow-amber-500/10"
                        : "text-zinc-400 hover:bg-gradient-to-r hover:from-amber-900/20 hover:to-transparent hover:text-white hover:border hover:border-amber-900/20"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`
                          absolute left-0 top-1/2 -translate-y-1/2
                          h-6 w-[3px] rounded-r-full bg-gradient-to-b from-amber-400 to-amber-500
                          transition-all duration-300
                          group-hover:opacity-100
                          ${isActive ? "opacity-100 shadow-lg shadow-amber-500/50" : "opacity-0"}
                        `} />

                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 shrink-0 ${
                          isActive 
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d1b14]" 
                            : "bg-amber-900/20 text-amber-400/70 group-hover:bg-amber-900/30 group-hover:text-amber-300"
                        }`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>

                        <span className="flex-1 truncate">{lbl}</span>

                        {badge && (
                          <span className="rounded-full bg-gradient-to-br from-amber-400 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-[#0d1b14] shadow-lg shadow-amber-500/30">
                            {badge}
                          </span>
                        )}
                        {badgeInfo && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
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
      <div className="relative border-t border-amber-900/20 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-900/20 bg-gradient-to-br from-amber-950/30 to-amber-900/10 p-4 transition-all duration-300 hover:border-amber-400/30 hover:bg-gradient-to-br hover:from-amber-950/40 hover:to-amber-900/20 hover:shadow-lg hover:shadow-amber-500/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-[#0d1b14] shrink-0 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/30">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">
              {isClient ? user?.username || user?.name || "Cliente" : user?.name || "Administrador"}
            </p>
            <p className="truncate text-[11px] text-amber-400/60">
              {user?.email || "admin@gepardo.com"}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:border-red-400/30 hover:shadow-lg hover:shadow-red-500/20 shrink-0"
          >
            <ArrowRightOnRectangleIcon className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};