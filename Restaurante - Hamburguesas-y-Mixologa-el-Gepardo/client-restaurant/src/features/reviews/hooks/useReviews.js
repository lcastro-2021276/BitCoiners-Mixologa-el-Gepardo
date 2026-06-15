// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\reviews\hooks\useReviews.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitReview = useCallback(async (reviewData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/reviews', reviewData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar reseña');
      return { success: false, error: err.response?.data?.message || 'Error al enviar reseña' };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async (targetType, targetId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get(`/reviews/${targetType}/${targetId}`);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener reseñas');
      return { success: false, error: err.response?.data?.message || 'Error al obtener reseñas' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.delete(`/reviews/${reviewId}`);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar reseña');
      return { success: false, error: err.response?.data?.message || 'Error al eliminar reseña' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitReview,
    fetchReviews,
    deleteReview,
    loading,
    error,
  };
};
