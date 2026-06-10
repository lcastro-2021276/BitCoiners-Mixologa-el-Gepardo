import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

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

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-5 border-b border-amber-900/20 bg-gradient-to-r from-[#0d1b14] via-[#0f1f16] to-[#0d1b14] px-6 backdrop-blur-xl shadow-lg shadow-black/20">

      {/* Hamburger – mobile only */}
      <button
        onClick={onMenuOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-all duration-300 hover:bg-amber-400/10 hover:text-amber-300 lg:hidden"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* Brand / page title */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="hidden h-8 w-[2px] shrink-0 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-400 lg:block shadow-lg shadow-amber-500/30" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-amber-400" />
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
      <div className="hidden lg:flex items-center gap-4 shrink-0">

        {/* Search */}
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 h-4 w-4 text-amber-400/60" />
          <input
            type="text"
            placeholder={
              isAdmin
                ? "Buscar pedidos, usuarios…"
                : "Buscar hamburguesas…"
            }
            className="
              h-10 w-[240px] rounded-xl border border-amber-900/30
              bg-gradient-to-r from-amber-950/20 to-amber-900/10 pl-10 pr-4
              text-[13px] text-white placeholder:text-amber-400/50
              outline-none transition-all duration-300
              focus:border-amber-400/50 focus:bg-amber-950/30 focus:w-[280px] focus:shadow-lg focus:shadow-amber-500/10
            "
          />
        </div>

        <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-900/30 to-transparent" />

        {/* Bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-900/30 bg-gradient-to-br from-amber-950/20 to-amber-900/10 text-zinc-400 transition-all duration-300 hover:border-amber-400/40 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10">
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute right-[10px] top-[10px] h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#0d1b14] animate-pulse shadow-lg shadow-amber-500/50" />
        </button>

        <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-900/30 to-transparent" />

        {/* User pill */}
        <div className="flex cursor-pointer items-center gap-3 rounded-2xl border border-amber-900/30 bg-gradient-to-br from-amber-950/20 to-amber-900/10 px-4 py-2 transition-all duration-300 hover:border-amber-400/40 hover:bg-gradient-to-br hover:from-amber-950/30 hover:to-amber-900/20 hover:shadow-lg hover:shadow-amber-500/10 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-bold text-[#0d1b14] ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:ring-amber-400/60 group-hover:scale-105">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-white">
              {user?.name || user?.username || (isAdmin ? "Administrador" : "Cliente")}
            </p>
            <p className="text-[11px] text-amber-400/70 font-medium">
              {isAdmin ? "Administrador" : "Cliente"}
            </p>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-amber-400/60 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-amber-300" />
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