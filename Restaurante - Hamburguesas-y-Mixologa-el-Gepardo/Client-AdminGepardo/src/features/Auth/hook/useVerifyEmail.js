// src/features/auth/hooks/useVerifyEmail.js
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosAuth } from "../../../shared/apis/api.js";
import toast from "react-hot-toast";

/**
 * Hook que maneja la verificación de email.
 * Lee el token de la URL: /verify-email?token=xxx
 */
export const useVerifyEmail = () => {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [status, setStatus]     = useState("loading"); 
  const [message, setMessage]   = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado.");
      return;
    }

    const verify = async () => {
      try {
        const res = await axiosAuth.get(`/auth/verify-email?token=${token}`);
        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message || "Email verificado correctamente.");
          toast.success("Email verificado. Ya puedes iniciar sesión.");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(res.data.message || "El token es inválido o expiró.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Error al verificar el email."
        );
      }
    };

    verify();
  }, [searchParams, navigate]);

  return { status, message };
};