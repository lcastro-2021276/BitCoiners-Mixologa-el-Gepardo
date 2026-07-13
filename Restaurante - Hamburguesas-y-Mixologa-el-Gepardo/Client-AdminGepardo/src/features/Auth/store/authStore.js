import { create } from "zustand";
import { axiosAdmin } from "../../../shared/apis/api.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: true,

  login: async (data) => {
    set({ loading: true, error: null });

    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const res = await axiosAdmin.post("/auth/login", payload);

      console.log("LOGIN RESPONSE:", res.data);

      const responseData = res.data;

      const token = responseData.token || responseData.accessToken;
      const refreshToken = responseData.refreshToken || null;
      const user = responseData.user || responseData.userDetails;

      if (!token) {
        toast.error("No se recibió token");
        set({ loading: false, error: "Token inválido" });
        return { success: false };
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      toast.success("Login exitoso");

      return { success: true, user };
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Error al iniciar sesión";

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      return { success: false };
    }
  },

  checkAuth: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (user && token) {
      set({
        user: JSON.parse(user),
        token,
        refreshToken,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } else {
      set({
        isCheckingAuth: false,
      });
    }
  },

  logout: () => {
    localStorage.clear();

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
