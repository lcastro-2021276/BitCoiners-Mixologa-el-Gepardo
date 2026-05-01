import { useForm } from "react-hook-form";

export const ForgotPassword = ({ onSwitch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Recuperar contraseña:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* EMAIL */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          Email
        </label>

        <input
          type="email"
          id="email"
          placeholder="email@restaurante.com"
          className="w-full px-3 py-2 text-sm rounded-lg outline-none transition"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          {...register("email", {
            required: "Este campo es obligatorio",
          })}
        />

        {errors.email && (
          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-error)" }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full py-2.5 px-4 rounded-lg font-medium transition hover:opacity-90"
        style={{
          background: "var(--color-accent)",
          color: "#fff",
          boxShadow: "var(--shadow-md)",
        }}
      >
        Enviar instrucciones 📩
      </button>

      {/* SWITCH */}
      <p
        className="text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        ¿Recordaste tu contraseña?{" "}

        <button
          type="button"
          onClick={onSwitch}
          className="hover:underline transition"
          style={{ color: "var(--color-secondary)" }}
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
};