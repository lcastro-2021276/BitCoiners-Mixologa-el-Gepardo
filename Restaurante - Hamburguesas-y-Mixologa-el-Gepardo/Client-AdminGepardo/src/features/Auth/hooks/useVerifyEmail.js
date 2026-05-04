import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosAuth } from "../../../shared/apis/api.js";

export const useVerifyEmail = () => {
  const [status, setStatus]   = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado.");
      return;
    }

    axiosAuth
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message || "Tu email ha sido verificado correctamente.");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "El enlace es inválido o ha expirado."
        );
      });
  }, []);

  return { status, message };
};
