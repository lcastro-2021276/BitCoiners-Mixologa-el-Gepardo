import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5022/api/auth",
  headers: {
    "Content-Type": "application/json"
  }
});

export const auth = {
  login: async (data) => {
    const response = await api.post("/login", data);

    console.log("LOGIN RESPONSE:", response.data);

    return response.data;
  }
};