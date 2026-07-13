import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const auth = {
  login: async (data) => {
    console.log("DATA QUE LLEGA A AUTH:", data);
    
    // Axios convierte automáticamente el objeto 'data' a JSON
    const response = await api.post("/auth/login", data);

    console.log("LOGIN RESPONSE:", response.data);

    return response.data;
  },
};