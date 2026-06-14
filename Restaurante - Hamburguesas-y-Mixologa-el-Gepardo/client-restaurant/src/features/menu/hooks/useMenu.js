// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\menu\hooks\useMenu.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useMenu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/menu-items');
      
      const menuItems = response.data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price || 0,
        restaurant: item.restaurant,
        imageUrl: item.imageUrl,
        available: item.available !== undefined ? item.available : true,
        isDeleted: item.isDeleted || false,
        createdAt: item.createdAt,
      }));

      return { success: true, data: menuItems };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener menú');
      return { success: false, error: err.response?.data?.message || 'Error al obtener menú' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenuItem = useCallback(async (menuData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/menu-items', menuData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear item de menú');
      return { success: false, error: err.response?.data?.message || 'Error al crear item de menú' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMenuItem = useCallback(async (itemId, menuData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/menu-items/${itemId}`, menuData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar item de menú');
      return { success: false, error: err.response?.data?.message || 'Error al actualizar item de menú' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMenuItem = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/menu-items/${itemId}`, { available: false });
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar item de menú');
      return { success: false, error: err.response?.data?.message || 'Error al eliminar item de menú' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    loading,
    error,
  };
};
