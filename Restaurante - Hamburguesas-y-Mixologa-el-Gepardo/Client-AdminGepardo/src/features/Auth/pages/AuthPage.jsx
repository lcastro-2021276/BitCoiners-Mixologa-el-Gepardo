import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginForm } from "../components/LoginForm";
import { ForgotPassword } from "../components/ForgotPassword";

export const AuthPage = () => {
  const [view, setView]  = useState("login");
  const navigate         = useNavigate();
  const isAuthenticated  = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* CARD */}
      <div
        className="w-full max-w-md animate-fadeIn"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* HEADER DE LA CARD */}
        <div
          className="px-10 pt-10 pb-8"
          style={{
            borderBottom: "1px solid var(--border-color)",
            background: "linear-gradient(160deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
          }}
        >
          {/* LÍNEA DECORATIVA */}
          <div
            className="w-10 h-1 mb-6 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />

          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.3px" }}
          >
            Hamburguesas y Mixología
          </h1>
          <p
            className="text-sm mt-1 font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            El Gepardo
          </p>
          <p
            className="text-xs mt-3"
            style={{ color: "var(--text-muted)" }}
          >
            {view === "login"
              ? "Ingresa tus credenciales para acceder al panel"
              : "Escribe tu correo para recuperar el acceso"}
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="px-10 py-8">
          {view === "login"
            ? <LoginForm onForgot={() => setView("forgot")} />
            : <ForgotPassword onSwitch={() => setView("login")} />
          }
        </div>
      </div>
    </div>
  );
};