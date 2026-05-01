// src/features/auth/pages/UnauthorizedPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="w-full max-w-md p-10 rounded-2xl text-center animate-fadeIn"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* ICONO */}
        <div
          className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.12)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#ef4444" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* LÍNEA DECORATIVA */}
        <div
          className="w-8 h-0.5 mx-auto mb-5 rounded-full"
          style={{ background: "var(--color-error)" }}
        />

        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Acceso no autorizado
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          Tu rol <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
            {user?.role || "actual"}
          </span> no tiene permiso para ver esta página.
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          Contacta al administrador si crees que esto es un error.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-80"
            style={{
              background: "transparent",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            Volver
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Ir al dashboard
          </button>
        </div>
      </div>
    </div>
  );
};