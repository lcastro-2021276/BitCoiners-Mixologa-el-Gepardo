import { create } from "zustand";
import { axiosAuth } from "../../../shared/apis/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: false,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const isEmail = data.emailOrUsername.includes("@");
      const payload = {
        password: data.password,
        ...(isEmail
          ? { email: data.emailOrUsername }
          : { username: data.emailOrUsername }),
      };

      console.log("payload enviado:", payload);
      console.log("URL base:", axiosAuth.defaults.baseURL);

      const res = await axiosAuth.post("/auth/login", payload);
      console.log("respuesta axios:", res);
      const responseData = res.data;

      if (responseData.success) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
        console.log("RESPUESTA COMPLETA DEL BACKEND:", res.data);
        localStorage.setItem("refreshToken", responseData.refreshToken);
        set({
          user: responseData.user,
          token: responseData.token,
          refreshToken: responseData.refreshToken,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ error: responseData.message || "Error al iniciar sesión", loading: false });
      }

      return {
        success: responseData.success || false,
        user: responseData.user || null,
        token: responseData.token || null,
        message: responseData.message || null,
      };
    } catch (err) {
      console.log("error en login:", err);
      set({
        error: err.response?.data?.message || "Error desconocido",
        loading: false,
      });
      return { success: false, message: err.response?.data?.message || "Error desconocido" };
    }
  },

 logout: () => {
  localStorage.removeItem("user");       // ← agregar
  localStorage.removeItem("token", responseData.token);      // ← agregar
  localStorage.removeItem("refreshToken"); // ← agregar
  set({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  });
},

  checkAuth: () => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (savedUser && savedToken) {
      set({
        user: JSON.parse(savedUser),
        token: savedToken,
        refreshToken: savedRefresh,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } else {
      set({ isCheckingAuth: false });
    }
  },
}));