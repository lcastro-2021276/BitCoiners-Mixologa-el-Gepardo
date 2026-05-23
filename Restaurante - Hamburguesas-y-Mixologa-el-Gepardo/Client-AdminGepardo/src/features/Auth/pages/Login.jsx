import { useState } from "react";
import { auth } from "../../../shared/apis/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      // DEBUG
      console.log("FORM ENVIADO:", form);

      // LOGIN
      const res = await auth.login(form);

      console.log("RESPUESTA COMPLETA:", res);

      // VALIDAR SUCCESS
      if (!res.success) {
        setError(res.message || "Credenciales incorrectas ❌");
        return;
      }

      // VALIDAR TOKEN
      if (!res.token) {
        setError("No se recibió token ❌");
        return;
      }

      // GUARDAR TOKEN
      localStorage.setItem("token", res.token);

      // GUARDAR USUARIO
      localStorage.setItem("user", JSON.stringify(res.user));

      // GUARDAR ROLE
      localStorage.setItem("role", res.role);

      console.log("TOKEN:", res.token);
      console.log("ROLE:", res.role);
      console.log("USER:", res.user);

      // REDIRECCIONAR
      window.location.href = "/dashboard";

    } catch (err) {

      console.log("ERROR COMPLETO:", err);

      // ERROR BACKEND
      if (err.response) {

        console.log("ERROR RESPONSE:", err.response.data);

        setError(
          err.response.data.message ||
          "Credenciales inválidas ❌"
        );

      } else {
        setError("No se pudo conectar con el servidor ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
        background: "var(--bg-dark)",
      }}
    >

      {/* FONDO */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(183,109,27,0.12) 0%, transparent 60%)," +
            "radial-gradient(ellipse at 75% 20%, rgba(91,78,106,0.15) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* CARD */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1050px",
          display: "flex",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          background: "rgba(15,15,20,0.85)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
        }}
      >

        {/* IZQUIERDA */}
        <div
          style={{
            width: "50%",
            padding: "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(to bottom right, rgba(183,109,27,0.08), rgba(8,8,12,0.6))",
            borderRight: "1px solid var(--border-color)",
          }}
        >

          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-accent-soft))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              marginBottom: "28px",
              boxShadow: "0 0 40px rgba(183,109,27,0.3)",
            }}
          >
            🐆
          </div>

          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: "30px",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            El Gepardo Admin
          </h1>

          <p
            style={{
              color: "var(--color-accent)",
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            Hamburguesas y Mixología
          </p>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              textAlign: "center",
              maxWidth: "300px",
              lineHeight: 1.7,
            }}
          >
            Sistema moderno y seguro para administrar pedidos,
            inventario y operaciones del restaurante.
          </p>
        </div>

        {/* DERECHA */}
        <div
          style={{
            width: "50%",
            padding: "50px",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          {/* TITULO */}
          <div style={{ marginBottom: "28px" }}>
            <h2
              style={{
                color: "var(--text-primary)",
                fontSize: "30px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Iniciar sesión
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

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
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >

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
                placeholder="correo@empresa.com"
                onChange={handleChange}
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
                placeholder="••••••••"
                onChange={handleChange}
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

            {/* BOTON */}
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
              }}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {/* FORGOT */}
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-accent)",
                fontSize: "13px",
                cursor: "pointer",
                padding: 0,
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}