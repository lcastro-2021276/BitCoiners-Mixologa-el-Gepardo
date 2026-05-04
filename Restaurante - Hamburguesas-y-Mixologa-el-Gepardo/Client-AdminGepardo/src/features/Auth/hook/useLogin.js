import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogin = () => {
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);
  const loading  = useAuthStore((s) => s.loading);
  const error    = useAuthStore((s) => s.error);

const handleLogin = async (data) => {
  console.log("data recibida:", data);
  const res = await login(data);
  console.log("respuesta del login:", res);
  if (res?.success) {
    toast.success("¡Bienvenido al Restaurante el Gepardo!", { duration: 3000 });
    navigate("/dashboard", { replace: true });
  } else {
    toast.error(res?.message || "Credenciales incorrectas");
  }
};

  return { handleLogin, loading, error };
};