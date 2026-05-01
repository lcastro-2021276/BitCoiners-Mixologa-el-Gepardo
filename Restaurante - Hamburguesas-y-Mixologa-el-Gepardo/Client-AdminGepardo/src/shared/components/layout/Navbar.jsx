// src/shared/components/layout/Navbar.jsx
import { Bars3Icon } from "@heroicons/react/24/outline";

export const Navbar = ({ title, subtitle, onMenuOpen }) => {
  return (
    <header
      className="flex items-center gap-3 px-5 sticky top-0 z-10"
      style={{
        height: "52px",
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Botón mobile */}
      <button
        className="lg:hidden"
        onClick={onMenuOpen}
        style={{ color: "var(--text-muted)" }}
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Título */}
      <div className="flex-1">
        <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Búsqueda */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 rounded-lg"
        style={{
          height: "32px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border-color)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Buscar...
        </span>
      </div>

      {/* Notificaciones */}
      <div
        className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border-color)",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
      </div>
    </header>
  );
};