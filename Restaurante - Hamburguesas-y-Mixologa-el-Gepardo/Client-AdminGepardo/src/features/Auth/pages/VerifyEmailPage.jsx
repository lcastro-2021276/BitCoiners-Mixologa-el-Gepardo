// src/features/auth/pages/VerifyEmailPage.jsx
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useNavigate } from "react-router-dom";

export const VerifyEmailPage = () => {
  const { status, message } = useVerifyEmail();
  const navigate = useNavigate();

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
        {/* LOADING */}
        {status === "loading" && (
          <>
            <div
              className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(183,109,27,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-accent)" strokeWidth="2"
                className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Verificando tu email...
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Por favor espera un momento.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div
              className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(74,222,128,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#4ade80" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              ¡Email verificado!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {message}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Redirigiendo al login en 3 segundos...
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div
              className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Error de verificación
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90"
              style={{ background: "var(--color-accent)", color: "#fff" }}
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
};