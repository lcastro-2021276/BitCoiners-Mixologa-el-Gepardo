// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\profile\hooks\useProfile.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';
import useAuthStore from '../../../shared/store/authStore.js';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuthStore();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/users/profile');
      
      const profile = {
        displayName: response.data.displayName || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        username: response.data.username || '',
      };

      return { success: true, data: profile };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener perfil');
      return { success: false, error: err.response?.data?.message || 'Error al obtener perfil' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put('/users/profile', profileData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
      return { success: false, error: err.response?.data?.message || 'Error al actualizar perfil' };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put('/users/change-password', passwordData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
      return { success: false, error: err.response?.data?.message || 'Error al cambiar contraseña' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.delete('/users/account');
      await logout();
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar cuenta');
      return { success: false, error: err.response?.data?.message || 'Error al eliminar cuenta' };
    } finally {
      setLoading(false);
    }
  }, [logout]);

  return {
    fetchProfile,
    updateProfile,
    handleLogout,
    changePassword,
    deleteAccount,
    loading,
    error,
  };
};
