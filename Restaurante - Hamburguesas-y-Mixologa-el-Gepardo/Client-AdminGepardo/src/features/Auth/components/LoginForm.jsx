import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export const LoginForm = ({ onForgot }) => {
  const login   = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error   = useAuthStore((s) => s.error);

  const [form, setForm] = useState({ emailOrUsername: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
        >
          Correo o usuario
        </label>
        <input
          type="text"
          name="emailOrUsername"
          value={form.emailOrUsername}
          onChange={handleChange}
          placeholder="tu@correo.com"
          required
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "14px",
            color: "var(--text-primary)",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
        >
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "14px",
            color: "var(--text-primary)",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "11px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          width: "100%",
          marginTop: "4px",
        }}
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <button
        onClick={onForgot}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-accent)",
          fontSize: "13px",
          cursor: "pointer",
          padding: 0,
          textAlign: "center",
        }}
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  );
};
