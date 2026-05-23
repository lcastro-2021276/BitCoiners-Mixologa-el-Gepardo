// Sidebar.jsx
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
} from "@heroicons/react/24/outline";

export const Sidebar = ({
  user,
  onLogout,
  isOpen,
  onClose,
}) => {

  // =========================================
  // DETECTAR SI ES CLIENTE
  // =========================================
  const isClient =
    user?.role === "Cliente" ||
    user?.role === "CLIENT";

  // =========================================
  // MENÚ DINÁMICO
  // =========================================
  const NAV_SECTIONS = [
    {
      label: "Principal",
      items: [
        {
          to: "/dashboard",
          label: "Inicio",
          icon: HomeIcon,
        },
        {
          to: "/dashboard/orders",
          label: "Pedidos",
          icon: ClipboardDocumentListIcon,
          badge: "12",
        },
        {
          to: "/dashboard/menu",
          label: "Menú",
          icon: QueueListIcon,
        },
        {
          to: "/dashboard/reservations",
          label: "Reservas",
          icon: CalendarDaysIcon,
          badgeInfo: "3",
        },
      ],
    },

    {
      label: isClient ? "Explorar" : "Administración",

      items: [
        {
          to: "/dashboard/restaurants",
          label: "Restaurantes",
          icon: BuildingStorefrontIcon,
        },

        {
          to: "/dashboard/tables",
          label: "Mesas",
          icon: TableCellsIcon,
        },

        // SOLO ADMIN VE USUARIOS
        ...(!isClient
          ? [
              {
                to: "/dashboard/users",
                label: "Usuarios",
                icon: UsersIcon,
              },
            ]
          : []),

        {
          to: "/dashboard/reviews",
          label: "Reseñas",
          icon: StarIcon,
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40
        flex h-screen w-[285px] flex-col
        overflow-hidden
        border-r border-white/10
        bg-[#0d1b14]
        shadow-2xl
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >

      {/* GLOW */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_40%)]
          pointer-events-none
        "
      />

      {/* BRAND */}
      <div className="relative border-b border-white/5 px-6 py-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                bg-gradient-to-br from-amber-300 to-amber-500
                text-[22px]
                shadow-lg shadow-amber-500/20
              "
            >
              🐆
            </div>

            <div>

              <h2 className="text-lg font-bold tracking-tight text-white">
                El Gepardo
              </h2>

              <p
                className="
                  text-[11px]
                  font-semibold uppercase tracking-[0.25em]
                  text-amber-300/70
                "
              >
                {isClient ? "Cliente Panel" : "Premium Dashboard"}
              </p>

            </div>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl p-2 text-zinc-400
              transition-all duration-200
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex-1 overflow-y-auto px-4 py-6">

        <div className="space-y-8">

          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label}>

              {/* LABEL */}
              <div className="mb-3 flex items-center gap-3 px-2">

                <span
                  className="
                    text-[10px]
                    font-bold uppercase tracking-[0.3em]
                    text-amber-300/40
                  "
                >
                  {label}
                </span>

                <div className="h-px flex-1 bg-white/5" />
              </div>

              {/* LINKS */}
              <div className="space-y-2">

                {items.map(
                  ({
                    to,
                    label: lbl,
                    icon: Icon,
                    badge,
                    badgeInfo,
                  }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/dashboard"}
                      onClick={onClose}
                      className={({ isActive }) => `
                        group relative flex items-center gap-3
                        overflow-hidden
                        rounded-2xl px-3 py-3
                        text-sm font-medium
                        transition-all duration-300

                        ${
                          isActive
                            ? `
                              bg-gradient-to-r
                              from-amber-400/15
                              to-amber-300/5
                              text-amber-300
                              border border-amber-400/10
                              shadow-lg shadow-amber-500/5
                            `
                            : `
                              text-zinc-300
                              hover:bg-white/5
                              hover:text-white
                            `
                        }
                      `}
                    >

                      {/* ACTIVE LINE */}
                      <div
                        className="
                          absolute left-0 top-0 h-full w-1
                          rounded-r-full bg-amber-400
                          opacity-0 transition-all duration-300
                          group-hover:opacity-100
                        "
                      />

                      {/* ICON */}
                      <div
                        className="
                          flex h-10 w-10 items-center justify-center
                          rounded-xl
                          bg-white/5
                          transition-all duration-300
                          group-hover:scale-105
                          group-hover:bg-white/10
                        "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* LABEL */}
                      <span className="flex-1 truncate">
                        {lbl}
                      </span>

                      {/* BADGES */}
                      {badge && (
                        <span
                          className="
                            rounded-full
                            bg-amber-400 px-2 py-1
                            text-[10px] font-bold
                            text-[#0d1b14]
                          "
                        >
                          {badge}
                        </span>
                      )}

                      {badgeInfo && (
                        <span
                          className="
                            rounded-full
                            border border-amber-400/20
                            bg-amber-400/10
                            px-2 py-1
                            text-[10px] font-semibold
                            text-amber-300
                          "
                        >
                          {badgeInfo}
                        </span>
                      )}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="relative border-t border-white/5 p-4">

        <div
          className="
            flex items-center gap-3
            rounded-2xl border border-white/5
            bg-white/5 p-3
            backdrop-blur-md
            transition-all duration-200
            hover:bg-white/10
          "
        >

          {/* AVATAR */}
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl
              bg-gradient-to-br from-amber-300 to-amber-500
              text-sm font-bold text-[#0d1b14]
              shadow-lg shadow-amber-500/20
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          {/* USER */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-white">
              {isClient
                ? user?.username || user?.name || "Cliente"
                : user?.name || "Administrador"}
            </p>

            <p className="truncate text-xs text-zinc-400">
              {user?.email || "admin@gepardo.com"}
            </p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-red-500/10
              bg-red-500/10
              text-red-400
              transition-all duration-200
              hover:scale-105
              hover:bg-red-500/20
            "
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};