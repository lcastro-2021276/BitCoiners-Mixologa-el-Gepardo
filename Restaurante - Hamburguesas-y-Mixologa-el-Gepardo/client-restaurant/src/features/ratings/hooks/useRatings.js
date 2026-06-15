// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\ratings\hooks\useRatings.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useRatings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitRating = useCallback(async (ratingData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/ratings', ratingData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar calificación');
      return { success: false, error: err.response?.data?.message || 'Error al enviar calificación' };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRatings = useCallback(async (targetType, targetId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get(`/ratings/${targetType}/${targetId}`);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener calificaciones');
      return { success: false, error: err.response?.data?.message || 'Error al obtener calificaciones' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserRating = useCallback(async (targetType, targetId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get(`/ratings/${targetType}/${targetId}/user`);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tu calificación');
      return { success: false, error: err.response?.data?.message || 'Error al obtener tu calificación' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitRating,
    fetchRatings,
    getUserRating,
    loading,
    error,
  };
};
