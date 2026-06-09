import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginForm } from "../components/LoginForm";
import { ForgotPassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
 
import bgLogo from "../../../assets/img/mixologias.png";
 
export const AuthPage = () => {
  const [view, setView] = useState("login");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const resetToken = searchParams.get("token");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resetToken) {
      setView("reset");
    }
  }, [resetToken]);
 
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      // Fondo crema igual que la imagen
      background: "#f5f0e8",
    }}>
 
      {/* Manchas decorativas de fondo (igual que la imagen) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(180,200,170,0.45) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 100% 100%, rgba(180,200,170,0.3) 0%, transparent 40%)," +
          "radial-gradient(ellipse at 15% 80%, rgba(200,170,100,0.25) 0%, transparent 35%)," +
          "radial-gradient(ellipse at 85% 10%, rgba(180,200,170,0.2) 0%, transparent 30%)",
      }} />
 
      {/* Card dos paneles */}
      <div
        className="animate-fadeIn"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1050px",
          margin: "24px",
          display: "flex",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
          border: "1px solid rgba(180,160,100,0.2)",
        }}
      >
 
        {/* PANEL IZQUIERDO — imagen */}
        <div style={{
          width: "55%",
          minHeight: "600px",
          backgroundImage: `url(${bgLogo})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          position: "relative",
        }}>
          {/* Sombra suave hacia la derecha */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 70%, rgba(245,240,232,0.6) 100%)",
          }} />
        </div>
 
        {/* PANEL DERECHO — formulario */}
        <div style={{
          width: "45%",
          padding: "52px 44px",
          background: "#faf7f2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderLeft: "1px solid rgba(180,160,100,0.15)",
        }}>
 
          {/* Badge */}
          <div style={{ marginBottom: "18px" }}>
            <span style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#1a3d2b",
              opacity: 0.5,
            }}>
              {view === "login" ? "Panel Administrativo" : view === "forgot" ? "Recuperar contraseña" : "Restablecer contraseña"}
            </span>
          </div>
 
          {/* Título */}
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{
              color: "#1a3d2b",
              fontSize: "26px",
              fontWeight: 800,
              marginBottom: "6px",
              letterSpacing: "-0.3px",
            }}>
              {view === "login" ? "Iniciar sesión" : view === "forgot" ? "Recuperar contraseña" : "Restablecer contraseña"}
            </h2>
            <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6 }}>
              {view === "login"
                ? "Ingresa tus credenciales para acceder al sistema."
                : view === "forgot"
                ? "Escribe tu correo para recuperar el acceso."
                : "Ingresa tu nueva contraseña para restablecer tu cuenta."}
            </p>
          </div>
 
          {/* Estilos del form */}
          <style>{`
            .gepardo-form-wrapper input {
              background: #fff !important;
              border: 1.5px solid #ddd8cc !important;
              border-radius: 10px !important;
              color: #1a1a1a !important;
              transition: border-color 0.2s ease !important;
            }
            .gepardo-form-wrapper input:focus {
              border-color: #1a3d2b !important;
              box-shadow: 0 0 0 3px rgba(26,61,43,0.07) !important;
            }
            .gepardo-form-wrapper input::placeholder {
              color: #bbb !important;
            }
            .gepardo-form-wrapper label {
              color: #666 !important;
            }
            .gepardo-form-wrapper button[type="submit"] {
              background: linear-gradient(135deg, #2d6a4f, #1a3d2b) !important;
              border-radius: 10px !important;
              letter-spacing: 1px !important;
              text-transform: uppercase !important;
              box-shadow: 0 6px 20px rgba(26,61,43,0.25) !important;
            }
            .gepardo-form-wrapper button[type="submit"]:hover {
              opacity: 0.88 !important;
            }
            .gepardo-form-wrapper button[type="button"] {
              color: #c9a84c !important;
            }
          `}</style>
 
          <div className="gepardo-form-wrapper">
            {view === "login"
              ? <LoginForm onForgot={() => setView("forgot")} />
              : view === "forgot"
              ? <ForgotPassword onSwitch={() => setView("login")} />
              : <ResetPassword token={resetToken} onSwitch={() => setView("login")} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};