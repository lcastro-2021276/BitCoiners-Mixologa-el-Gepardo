import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const useAuthGuard = () => {
  const navigate        = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token           = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  return { isAuthenticated };
};