// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\auth\hooks\useAuth.js
import { useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import useAuthStore from '../../../shared/store/authStore.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout } = useAuthStore();

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authClient.post('/login', {
        emailOrUsername: credentials.email || credentials.emailOrUsername,
        password: credentials.password,
      });

      // Destructurar con defaults para flexibilidad
      const {
        accessToken = response.data.token,
        token = response.data.accessToken,
        refreshToken,
        userDetails
      } = response.data;

      const finalToken = accessToken || token;
      const email = userDetails?.email || credentials.email || credentials.emailOrUsername;

      // Determinar rol según el dominio del email
      let role = 'client';
      if (email && email.includes('@kinal.edu.gt')) {
        role = 'admin';
      } else if (email && email.includes('@gmail.com')) {
        role = 'client';
      }

      const finalUserDetails = {
        ...userDetails,
        email,
        role
      };

      if (!finalToken) {
        throw new Error('No se recibió token de autenticación');
      }

      await login(finalToken, finalUserDetails, refreshToken || null);

      return { success: true };
    } catch (err) {
      console.error('Error en login:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      const friendlyMessage = serverMessage || 'Error al iniciar sesión';
      setError(friendlyMessage);
      return { success: false, error: friendlyMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // No enviar confirmPassword al backend
      const { confirmPassword, ...dataToSend } = userData;

      const response = await authClient.post('/register', dataToSend);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      return { success: false, error: err.response?.data?.message || 'Error al registrarse' };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return {
    handleLogin,
    handleRegister,
    logout: handleLogout,
    loading,
    error,
  };
};