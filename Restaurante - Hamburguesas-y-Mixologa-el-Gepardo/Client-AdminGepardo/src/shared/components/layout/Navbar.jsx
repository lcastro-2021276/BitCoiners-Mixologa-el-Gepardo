// Navbar.jsx
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const Navbar = ({
  title,
  subtitle,
  onMenuOpen,
  user,
}) => {

  const isAdmin =
    user?.role === "Admin" ||
    user?.role === "ADMIN";

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[68px] items-center gap-6
        border-b border-[#1a3022]
        bg-[#0d1b14]
        px-6
      "
    >
      {/* MENU MOBILE */}
      <button
        onClick={onMenuOpen}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-lg text-zinc-400
          transition-colors duration-200
          hover:bg-white/8 hover:text-white
          lg:hidden
        "
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* TITLE BLOCK */}
      <div className="flex flex-1 items-center gap-3">
        {/* Accent bar */}
        <div className="h-8 w-[3px] rounded-full bg-amber-400" />

        <div>
          <h1 className="text-[17px] font-bold text-white leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative hidden lg:flex items-center">
        <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          placeholder={
            isAdmin ? "Buscar pedidos, usuarios..." : "Buscar hamburguesas..."
          }
          className="
            w-[220px] pl-9 pr-4 py-2
            rounded-lg
            border border-[#1a3022]
            bg-[#0f2018]
            text-[13px] text-white
            placeholder:text-zinc-500
            outline-none
            transition-all duration-200
            focus:border-amber-400/40 focus:w-[260px]
          "
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">

        {/* NOTIFICATIONS */}
        <button
          className="
            relative flex h-9 w-9 items-center justify-center
            rounded-lg
            border border-[#1a3022]
            bg-[#0f2018]
            text-zinc-400
            transition-all duration-200
            hover:border-amber-400/30
            hover:text-amber-300
          "
        >
          <BellIcon className="h-[18px] w-[18px]" />
          <span
            className="
              absolute right-2 top-2
              h-1.5 w-1.5 rounded-full
              bg-amber-400
              ring-[1.5px] ring-[#0d1b14]
            "
          />
        </button>

        {/* DIVIDER */}
        <div className="h-6 w-px bg-[#1a3022]" />

        {/* PROFILE */}
        <div
          className="
            hidden md:flex items-center gap-2.5
            cursor-pointer
            group
          "
        >
          {/* Avatar */}
          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full
              bg-amber-400
              text-[12px] font-bold text-[#0d1b14]
              ring-2 ring-amber-400/20
              transition-all duration-200
              group-hover:ring-amber-400/50
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-white">
              {isAdmin
                ? user?.name || "Administrador"
                : user?.username || user?.name || "Cliente"}
            </p>
            <p className="text-[11px] text-zinc-500">
              {isAdmin ? "Administrador" : "Cliente activo"}
            </p>
          </div>

          <ChevronDownIcon className="h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
};