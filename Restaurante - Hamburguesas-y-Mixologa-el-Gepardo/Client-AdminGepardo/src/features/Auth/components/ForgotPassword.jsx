import { useState } from "react";
import { axiosAuth } from "../../../shared/apis/api.js";

export const ForgotPassword = ({ onSwitch }) => {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axiosAuth.post("/auth/forgot-password", { email });
      setStatus("success");
      setMessage("Revisa tu correo para restablecer tu contraseña.");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "No se pudo enviar el correo.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {status === "success" ? (
        <div
          style={{
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: "8px",
            padding: "14px",
            fontSize: "13px",
            color: "#4ade80",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      ) : (
        <>
          {status === "error" && (
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
              {message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "11px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              width: "100%",
            }}
          >
            {status === "loading" ? "Enviando..." : "Enviar enlace"}
          </button>
        </>
      )}

      <button
        onClick={onSwitch}
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
        ← Volver al login
      </button>
    </div>
  );
};
