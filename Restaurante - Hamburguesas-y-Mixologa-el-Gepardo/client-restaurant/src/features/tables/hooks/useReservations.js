import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/reservations');

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al obtener reservaciones';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (reservationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/reservations', reservationData);

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear reservación';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (reservationId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.delete(`/reservations/${reservationId}`);

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cancelar reservación';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchReservations,
    createReservation,
    cancelReservation,
    loading,
    error,
  };
};
