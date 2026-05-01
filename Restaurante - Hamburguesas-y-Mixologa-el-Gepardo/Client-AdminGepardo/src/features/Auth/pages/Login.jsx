import { useState } from "react";
import { auth } from "../../../shared/apis/auth";
import "../../../style/global.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login(form);

      localStorage.setItem("token", res.token);

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Credenciales incorrectas ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="card login-card">
          <h2 className="login-title">🍔 El Gepardo Admin</h2>
          <p className="login-subtitle">
            Accede al sistema de gestión
          </p>

          <form onSubmit={handleLogin}>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
            />

            <button className="btn btn-primary btn-full">
              Iniciar Sesión
            </button>
          </form>

          <p className="forgot">
            ¿Olvidaste tu contraseña?
          </p>
        </div>
      </div>
    </div>
  );
}