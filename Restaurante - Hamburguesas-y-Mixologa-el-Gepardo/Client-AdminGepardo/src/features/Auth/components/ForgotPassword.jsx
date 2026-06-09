import { useState } from "react";
import { axiosAuth } from "../../../shared/apis/api.js";

export const ForgotPassword = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Por favor ingresa un correo electrónico válido");
      return;
    }

    setStatus("loading");
    try {
      const response = await axiosAuth.post("/auth/forgot-password", { email });
      setStatus("success");
      setMessage("Se ha enviado un correo con las instrucciones para restablecer tu contraseña");
      
      // En desarrollo, guardar el token para simular el flujo
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "No se pudo enviar el correo. Por favor intenta nuevamente.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#1a3d2b",
          margin: "0 0 8px 0",
          fontFamily: "'Cormorant Garamond', Georgia, serif"
        }}>
          ¿Olvidaste tu contraseña?
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#666",
          margin: 0,
          lineHeight: "1.5"
        }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña de forma segura.
        </p>
      </div>

      {status === "success" ? (
        <div style={{
          background: "linear-gradient(135deg, rgba(45,106,79,0.1), rgba(45,106,79,0.05))",
          border: "1px solid rgba(45,106,79,0.3)",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✉️</div>
          <p style={{
            fontSize: "14px",
            color: "#2d6a4f",
            fontWeight: 600,
            margin: "0 0 8px 0"
          }}>
            {message}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#666",
            margin: 0
          }}>
            Revisa tu bandeja de entrada y carpeta de spam.
          </p>
          {resetToken && (
            <div style={{
              marginTop: "12px",
              padding: "8px",
              background: "rgba(251,191,36,0.1)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#b45309"
            }}>
              <strong>Modo Desarrollo:</strong> Token: {resetToken.substring(0, 20)}...
            </div>
          )}
        </div>
      ) : (
        <>
          {status === "error" && (
            <div style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "13px",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
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
              disabled={status === "loading"}
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
                transition: "all 0.2s",
                opacity: status === "loading" ? 0.6 : 1
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
              transition: "all 0.2s"
            }}
            onMouseOver={e => {
              if (status !== "loading") {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 8px 25px rgba(26,61,43,0.3)";
              }
            }}
            onMouseOut={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 6px 20px rgba(26,61,43,0.25)";
            }}
          >
            {status === "loading" ? "Enviando..." : "Enviar enlace de recuperación"}
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
          fontWeight: 500,
          transition: "color 0.2s"
        }}
        onMouseOver={e => e.target.style.color = "#b8973b"}
        onMouseOut={e => e.target.style.color = "#c9a84c"}
      >
        ← Volver al inicio de sesión
      </button>
    </div>
  );
};
 