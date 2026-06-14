// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\hooks\useTables.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useTables = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/tables');
      
      const tables = response.data.map((table) => ({
        id: table.id,
        number: table.number,
        capacity: table.capacity || 4,
        status: table.status || 'disponible',
        location: table.location,
        isDeleted: table.isDeleted || false,
      }));

      return { success: true, data: tables };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener mesas');
      return { success: false, error: err.response?.data?.message || 'Error al obtener mesas' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createTable = useCallback(async (tableData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/tables', tableData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear mesa');
      return { success: false, error: err.response?.data?.message || 'Error al crear mesa' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTable = useCallback(async (tableId, tableData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/tables/${tableId}`, tableData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar mesa');
      return { success: false, error: err.response?.data?.message || 'Error al actualizar mesa' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTable = useCallback(async (tableId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.delete(`/tables/${tableId}`);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar mesa');
      return { success: false, error: err.response?.data?.message || 'Error al eliminar mesa' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    loading,
    error,
  };
};
