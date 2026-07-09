import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications.js";

export const Navbar = ({ title, subtitle, onMenuOpen, user }) => {
  const isAdmin =
    user?.role === "Admin" ||
    user?.role === "ADMIN" ||
    user?.role === "admin";

  const initials =
    (user?.name || user?.username || "U")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const navOptions = isAdmin
    ? [
        { label: "🏠 Inicio", path: "/dashboard" },
        { label: "📋 Pedidos", path: "/dashboard/orders" },
        { label: "🍽️ Menú", path: "/dashboard/menu" },
        { label: "📅 Reservas", path: "/dashboard/reservations" },
        { label: "🏪 Restaurantes", path: "/dashboard/restaurants" },
        { label: "🪑 Mesas", path: "/dashboard/tables" },
        { label: "👥 Usuarios", path: "/dashboard/users" },
        { label: "⭐ Reseñas", path: "/dashboard/reviews" },
      ]
    : [
        { label: "🏠 Inicio", path: "/dashboard" },
        { label: "📋 Pedidos", path: "/dashboard/orders" },
        { label: "🍽️ Menú", path: "/dashboard/menu" },
        { label: "📅 Reservas", path: "/dashboard/reservations" },
        { label: "🏪 Restaurantes", path: "/dashboard/restaurants" },
        { label: "🪑 Mesas", path: "/dashboard/tables" },
        { label: "⭐ Reseñas", path: "/dashboard/reviews" },
      ];

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-5 border-b border-amber-500/15 bg-gradient-to-r from-[#0d1b14] via-[#1a2e23] to-[#0d1b14] px-6 backdrop-blur-xl shadow-lg shadow-black/20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/3 via-amber-400/5 to-amber-500/3 animate-pulse" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyMHptNDAgMEwwIDQwVjIwTDIwIDQweiIgZmlsbD0iI0M5OTcyQSIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

      {/* Hamburger – mobile only */}
      <button
        onClick={onMenuOpen}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-all duration-300 hover:bg-amber-400/20 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/20 lg:hidden"
      >
        <Bars3Icon className="h-5 w-5" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/0 to-amber-500/0 hover:from-amber-500/10 hover:to-amber-400/10 transition-all duration-300" />
      </button>

      {/* Brand / page title */}
      <div className="relative flex min-w-0 flex-1 items-center gap-4 z-10">
        <div className="hidden h-8 w-[2px] shrink-0 rounded-full bg-gradient-to-b from-amber-400/70 via-amber-500/60 to-amber-400/70 lg:block shadow-lg shadow-amber-500/20" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-amber-400/80" />
            <h1 className="truncate text-[16px] font-bold leading-tight tracking-tight text-white">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="truncate text-[11px] leading-tight text-amber-400/60 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Desktop right section ── */}
      <div className="hidden lg:flex items-center gap-4 shrink-0 relative z-10">

        {/* Navigation Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNavDropdown(!showNavDropdown)}
            className="relative flex items-center gap-3 rounded-2xl border-2 border-amber-500/25 bg-gradient-to-br from-amber-950/30 via-amber-900/20 to-amber-950/30 px-5 py-2.5 transition-all duration-300 hover:border-amber-400/40 hover:bg-gradient-to-br hover:from-amber-950/40 hover:via-amber-900/30 hover:to-amber-950/40 hover:shadow-xl hover:shadow-amber-500/15 hover:scale-105 group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-400/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-[13px] font-bold text-white">¿A dónde quieres ir?</span>
            <ChevronDownIcon className={`relative h-4 w-4 text-amber-400/70 transition-transform duration-300 ${showNavDropdown ? 'rotate-180' : ''} group-hover:text-amber-400/90`} />
          </button>

          {showNavDropdown && (
            <div className="absolute top-full right-0 mt-3 w-64 rounded-2xl border-2 border-amber-500/25 bg-gradient-to-br from-[#0d1b14] via-[#1a2e23] to-[#0d1b14] shadow-2xl shadow-amber-500/15 overflow-hidden z-50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-500/3" />
              <div className="relative p-2">
                {navOptions.map((option) => (
                  <a
                    key={option.path}
                    href={option.path}
                    className="relative flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] text-zinc-300 hover:bg-amber-400/10 hover:text-amber-200 transition-all duration-200 border border-transparent hover:border-amber-500/20 last:border-0 hover:scale-[1.02]"
                    onClick={() => setShowNavDropdown(false)}
                  >
                    <span className="relative">{option.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

        {/* Bell with notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-amber-900/15 text-zinc-400 transition-all duration-300 hover:border-amber-400/30 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-110"
          >
            <BellIcon className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-[8px] top-[8px] h-5 w-5 rounded-full bg-gradient-to-br from-amber-400/90 to-amber-500/90 text-[10px] font-bold text-[#0d1b14] flex items-center justify-center ring-2 ring-[#0d1b14] shadow-lg shadow-amber-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-400/5 to-amber-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border border-amber-500/20 bg-gradient-to-br from-[#0d1b14] via-[#1a2e23] to-[#0d1b14] shadow-xl shadow-amber-500/10 overflow-hidden z-50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/3 via-transparent to-amber-500/2" />
              <div className="relative flex items-center justify-between border-b border-amber-900/15 px-4 py-3">
                <h3 className="text-[13px] font-bold text-white">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[11px] text-amber-400/80 hover:text-amber-400 transition hover:scale-105"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>

              <div className="relative max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[13px] text-zinc-500">No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => markAsRead(notification._id)}
                      className={`relative px-4 py-3 border-b border-amber-900/15 cursor-pointer transition hover:bg-amber-400/5 hover:scale-[1.01] ${
                        !notification.read ? 'bg-amber-400/8' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          notification.type === 'order_created' ? 'bg-blue-400/80' :
                          notification.type === 'order_delivered' ? 'bg-green-400/80' :
                          'bg-amber-400/80'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-[12px] text-zinc-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-1">
                            {new Date(notification.createdAt).toLocaleString('es-GT')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

        {/* User pill */}
        <div className="relative flex cursor-pointer items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-amber-900/20 px-4 py-2 transition-all duration-300 hover:border-amber-400/60 hover:bg-gradient-to-br hover:from-amber-950/50 hover:to-amber-900/30 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-400/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-bold text-[#0d1b14] ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:ring-amber-400/60 group-hover:scale-110 group-hover:shadow-amber-500/50">
            {initials}
          </div>
          <div className="relative leading-tight">
            <p className="text-[13px] font-semibold text-white bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              {user?.name || user?.username || (isAdmin ? "Administrador" : "Cliente")}
            </p>
            <p className="text-[11px] text-amber-400/80 font-medium">
              {isAdmin ? "Administrador" : "Cliente"}
            </p>
          </div>
          <ChevronDownIcon className="relative h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-amber-300 group-hover:scale-110" />
        </div>

      </div>

      {/* ── Mobile right section ── */}
      <div className="flex items-center gap-3 lg:hidden">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-900/30 bg-gradient-to-br from-amber-950/20 to-amber-900/10 text-zinc-400">
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute right-[10px] top-[10px] h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#0d1b14] animate-pulse" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[12px] font-bold text-[#0d1b14] shadow-lg shadow-amber-500/30">
          {initials}
        </div>
      </div>

    </header>
  );
};