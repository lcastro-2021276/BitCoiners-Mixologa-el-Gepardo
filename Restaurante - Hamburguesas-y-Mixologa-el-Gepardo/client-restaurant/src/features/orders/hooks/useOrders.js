// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\orders\hooks\useOrders.js
import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.get('/orders');
      
      const orders = response.data.map((order) => ({
        id: order.id,
        table: order.table,
        items: order.items || [],
        total: order.total || 0,
        status: order.status || 'pendiente',
        createdAt: order.createdAt || new Date().toISOString(),
        isDeleted: order.isDeleted || false,
      }));

      return { success: true, data: orders };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener pedidos');
      return { success: false, error: err.response?.data?.message || 'Error al obtener pedidos' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.post('/orders', orderData);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear pedido');
      return { success: false, error: err.response?.data?.message || 'Error al crear pedido' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminClient.put(`/orders/${orderId}/status`, { status });
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar estado del pedido');
      return { success: false, error: err.response?.data?.message || 'Error al actualizar estado del pedido' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchOrders,
    createOrder,
    updateOrderStatus,
    loading,
    error,
  };
};
