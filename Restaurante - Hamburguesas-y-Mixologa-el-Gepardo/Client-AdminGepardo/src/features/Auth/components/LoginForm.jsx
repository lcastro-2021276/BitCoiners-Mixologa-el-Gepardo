import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const LoginForm = ({ onForgot }) => {

  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await login(form);

      console.log("LOGIN RESPONSE:", response);

      if (!response.success) return;

      const loggedUser = response.user;

      if (!loggedUser) {

        toast.error(
          "No se pudo obtener la información del usuario."
        );

        useAuthStore.getState().logout();

        return;
      }

      // =========================
      // DATOS USUARIO
      // =========================
      const userRole = (loggedUser.role?.name ?? "").toLowerCase();
      const userEmail = loggedUser.email?.toLowerCase() ?? "";

      console.log("ROLE:", userRole);
      console.log("EMAIL:", userEmail);

      // =========================
      // ADMIN
      // =========================
      if (userRole === "admin") {

        const esCorreoKinal =
          userEmail.endsWith("@kinal.edu.gt");

        if (!esCorreoKinal) {

          toast.error(
            "Los administradores deben usar correo @kinal.edu.gt"
          );

          useAuthStore.getState().logout();

          return;
        }

        toast.success("Bienvenido administrador");

        navigate("/dashboard");

        return;
      }

      // =========================
      // CLIENTE
      // =========================
      if (userRole === "cliente") {

        const esCorreoGmail =
          userEmail.endsWith("@gmail.com");

        if (!esCorreoGmail) {

          toast.error(
            "Los clientes deben usar una cuenta Gmail."
          );

          useAuthStore.getState().logout();

          return;
        }

        toast.success("Bienvenido cliente");

        navigate("/home");

        return;
      }

      // =========================
      // SIN PERMISOS
      // =========================
      toast.error("Tu cuenta no tiene permisos.");

      useAuthStore.getState().logout();

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        "Ocurrió un error inesperado."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            padding: "12px 14px",
            fontSize: "13px",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* EMAIL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <label
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
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
            borderRadius: "14px",
            padding: "14px 16px",
            fontSize: "14px",
            color: "var(--text-primary)",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* PASSWORD */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <label
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
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
            borderRadius: "14px",
            padding: "14px 16px",
            fontSize: "14px",
            color: "var(--text-primary)",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* BOTON LOGIN */}
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          padding: "14px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          width: "100%",
          marginTop: "6px",
          transition: "all 0.25s ease",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        }}
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      {/* VOLVER */}
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          fontSize: "13px",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        ← Volver a selección de portal
      </button>

      {/* FORGOT PASSWORD */}
      <button
        type="button"
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

    </form>
  );
};