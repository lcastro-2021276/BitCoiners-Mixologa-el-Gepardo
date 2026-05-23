import { useState } from "react";
import { axiosAuth } from "../../../shared/apis/api.js";
 
export const ForgotPassword = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
        <div style={{
          background: "rgba(45,106,79,0.08)",
          border: "1px solid rgba(45,106,79,0.3)",
          borderRadius: "10px",
          padding: "14px",
          fontSize: "13px",
          color: "#2d6a4f",
          textAlign: "center",
          fontWeight: 600,
        }}>
          {message}
        </div>
      ) : (
        <>
          {status === "error" && (
            <div style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#ef4444",
            }}>
              {message}
            </div>
          )}
 
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#666",
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              style={{
                background: "#fff",
                border: "1.5px solid #ddd8cc",
                borderRadius: "10px",
                padding: "13px 16px",
                fontSize: "14px",
                color: "#1a1a1a",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#1a3d2b"}
              onBlur={e => e.target.style.borderColor = "#ddd8cc"}
            />
          </div>
 
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              background: "linear-gradient(135deg, #2d6a4f, #1a3d2b)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              width: "100%",
              boxShadow: "0 6px 20px rgba(26,61,43,0.25)",
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
          color: "#c9a84c",
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
 