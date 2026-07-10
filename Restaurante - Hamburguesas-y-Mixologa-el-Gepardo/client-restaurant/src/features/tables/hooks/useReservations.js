// c:\Users\Informatica\Documents\2021276\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\hooks\useReservations.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = useCallback(async (reservationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/reservations', reservationData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reservación');
      return { success: false, error: err.response?.data?.message || 'Error al crear reservación' };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/reservations');
      
      const reservations = response.data.map((reservation) => ({
        id: reservation.id,
        tableId: reservation.tableId,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        specialRequests: reservation.specialRequests,
        status: reservation.status || 'confirmada',
        createdAt: reservation.createdAt,
      }));

      return { success: true, data: reservations };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener reservaciones');
      return { success: false, error: err.response?.data?.message || 'Error al obtener reservaciones' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (reservationId, reservationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/reservations/${reservationId}`, reservationData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar reservación');
      return { success: false, error: err.response?.data?.message || 'Error al actualizar reservación' };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (reservationId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/reservations/${reservationId}`, { status: 'cancelada' });
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar reservación');
      return { success: false, error: err.response?.data?.message || 'Error al cancelar reservación' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createReservation,
    fetchReservations,
    updateReservation,
    cancelReservation,
    loading,
    error,
  };
};
