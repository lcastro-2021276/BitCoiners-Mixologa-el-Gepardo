import { useState } from "react";
import { axiosAuth } from "../../../shared/apis/api.js";

export const ResetPassword = ({ token, onSwitch }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const validatePassword = (password) => {
    // Mínimo 6 caracteres
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      setStatus("error");
      setMessage("Por favor ingresa tu nueva contraseña");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setStatus("error");
      setMessage(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setStatus("loading");
    try {
      await axiosAuth.post("/auth/reset-password", { 
        token, 
        newPassword 
      });
      setStatus("success");
      setMessage("Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "No se pudo restablecer la contraseña. El token puede haber expirado.");
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
          Restablecer contraseña
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#666",
          margin: 0,
          lineHeight: "1.5"
        }}>
          Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
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
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
          <p style={{
            fontSize: "14px",
            color: "#2d6a4f",
            fontWeight: 600,
            margin: "0 0 12px 0"
          }}>
            ¡Contraseña restablecida!
          </p>
          <p style={{
            fontSize: "13px",
            color: "#666",
            margin: "0 0 16px 0",
            lineHeight: "1.5"
          }}>
            {message}
          </p>
          <button
            onClick={onSwitch}
            style={{
              background: "linear-gradient(135deg, #2d6a4f, #1a3d2b)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(26,61,43,0.2)"
            }}
          >
            Iniciar sesión
          </button>
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
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••"
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

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#666",
            }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
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

          <div style={{
            fontSize: "11px",
            color: "#888",
            padding: "8px 12px",
            background: "rgba(251,191,36,0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(251,191,36,0.2)"
          }}>
            💡 La contraseña debe tener al menos 6 caracteres
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
            {status === "loading" ? "Restableciendo..." : "Restablecer contraseña"}
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
