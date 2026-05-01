import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = ({ onForgot }) => {
  const { handleLogin, loading, error } = useLogin();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">

      {/* EMAIL */}
      <div className="space-y-1.5">
        <label
          className="block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Email o Usuario
        </label>
        <input
          type="text"
          placeholder="correo@restaurante.com"
          autoComplete="username"
          className="w-full px-4 py-3 text-sm rounded-lg outline-none transition"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
          onBlur={e  => e.target.style.borderColor = "var(--border-color)"}
          {...register("emailOrUsername", { required: "Este campo es obligatorio" })}
        />
        {errors.emailOrUsername && (
          <p className="text-xs" style={{ color: "var(--color-error)" }}>
            {errors.emailOrUsername.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <label
          className="block text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-3 pr-16 text-sm rounded-lg outline-none transition"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e  => e.target.style.borderColor = "var(--border-color)"}
            {...register("password", {
              required: "Este campo es obligatorio",
              minLength: { value: 4, message: "Mínimo 4 caracteres" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wider transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            {showPass ? "Ocultar" : "Ver"}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs" style={{ color: "var(--color-error)" }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ERROR BACKEND */}
      {error && (
        <div
          className="text-sm px-4 py-3 rounded-lg"
          style={{
            color: "var(--color-error)",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg font-semibold text-sm tracking-wide transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(183,109,27,0.35)",
          marginTop: "8px",
        }}
      >
        {loading ? "Verificando credenciales..." : "Iniciar Sesión"}
      </button>

      {/* FORGOT */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onForgot}
          className="text-xs transition hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

    </form>
  );
};