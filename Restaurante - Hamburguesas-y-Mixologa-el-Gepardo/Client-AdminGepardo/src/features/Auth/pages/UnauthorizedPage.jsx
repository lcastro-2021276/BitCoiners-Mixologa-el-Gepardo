// src/features/auth/pages/UnauthorizedPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* GLOW BACKGROUND */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(239,68,68,0.08)",
          filter: "blur(120px)",
          borderRadius: "50%",
          top: "-120px",
          right: "-120px",
        }}
      />

      <div
        className="w-full max-w-md p-10 rounded-2xl text-center animate-fadeIn relative"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* ICON */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "rgba(239,68,68,0.12)",
            boxShadow: "0 0 30px rgba(239,68,68,0.15)",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* TITLE */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Acceso no autorizado
        </h2>

        {/* ROLE BADGE */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "var(--color-error)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 10px #ef4444",
            }}
          />
          ERROR 403
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          Tu rol{" "}
          <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
            {user?.role || "actual"}
          </span>{" "}
          no tiene permiso para ver esta página.
        </p>

        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          Si necesitas acceso, solicita permisos al administrador del sistema.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3 justify-center flex-wrap">
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
            style={{
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(239,68,68,0.25)",
            }}
          >
            Ir al dashboard
          </button>
        </div>

        {/* FOOTER */}
        <div
          className="mt-8 pt-4 text-xs"
          style={{
            borderTop: "1px solid var(--border-color)",
            color: "var(--text-muted)",
          }}
        >
          Sistema de seguridad activo • Control de accesos
        </div>
      </div>
    </div>
  );
};