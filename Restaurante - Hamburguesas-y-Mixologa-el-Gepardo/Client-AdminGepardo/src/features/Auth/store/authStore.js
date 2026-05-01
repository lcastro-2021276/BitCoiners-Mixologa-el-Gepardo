// src/features/auth/store/authStore.js
import { create } from "zustand";
import { axiosAuth } from "../../../shared/apis/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosAuth.post("/auth/login", data);
      const responseData = res.data;

      if (responseData.success) {
        set({
          user: responseData.user,
          token: responseData.accessToken,
          refreshToken: responseData.refreshToken,
          loading: false,
        });
      } else {
        set({ error: responseData.message || "Error al iniciar sesión", loading: false });
      }

      // devolver objeto compatible con LoginForm
      return {
        success: responseData.success || false,
        user: responseData.user || null,
        token: responseData.accessToken || null,
        message: responseData.message || null,
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error desconocido",
        loading: false,
      });
      return { success: false, message: err.response?.data?.message || "Error desconocido" };
    }
  },

  logout: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
    }),

  checkAuth: () => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (savedUser && savedToken) {
      set({
        user: JSON.parse(savedUser),
        token: savedToken,
        refreshToken: savedRefresh,
      });
    }
  },
}));