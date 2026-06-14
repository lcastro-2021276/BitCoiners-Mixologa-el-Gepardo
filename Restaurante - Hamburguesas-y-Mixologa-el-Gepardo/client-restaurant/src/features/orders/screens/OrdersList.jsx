// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\orders\screens\OrdersList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { useOrders } from '../hooks/useOrders.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const OrdersList = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchOrders, loading, error } = useOrders();

  const loadOrders = useCallback(async () => {
    const result = await fetchOrders();
    if (result.success) {
      setOrders(result.data);
    }
  }, [fetchOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return COLORS.warning;
      case 'preparacion':
        return COLORS.primary;
      case 'entregado':
        return COLORS.success;
      default:
        return COLORS.secondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'preparacion':
        return 'En Preparación';
      case 'entregado':
        return 'Entregado';
      default:
        return status;
    }
  };

  const calculateKPIs = () => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === 'pendiente').length;
    const preparing = orders.filter((o) => o.status === 'preparacion').length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return { totalOrders, pending, preparing, revenue };
  };

  const kpis = calculateKPIs();

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pedidos</Text>
        </View>

      <View style={styles.kpiContainer}>
        <Card style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{kpis.totalOrders}</Text>
          <Text style={styles.kpiLabel}>Total Pedidos</Text>
        </Card>
        <Card style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: COLORS.warning }]}>{kpis.pending}</Text>
          <Text style={styles.kpiLabel}>Pendientes</Text>
        </Card>
        <Card style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: COLORS.primary }]}>{kpis.preparing}</Text>
          <Text style={styles.kpiLabel}>En Preparación</Text>
        </Card>
        <Card style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: COLORS.success }]}>
            ${kpis.revenue.toFixed(2)}
          </Text>
          <Text style={styles.kpiLabel}>Ingresos</Text>
        </Card>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      {orders.length === 0 ? (
        <EmptyState message="No hay pedidos registrados" icon={<MaterialIcons name="receipt-long" size={48} color={COLORS.secondary} />} />
      ) : (
        <View style={styles.ordersContainer}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order._id || order.id || order.table?.number || JSON.stringify(order)}
              style={styles.orderCard}
              onPress={() => navigation.navigate('CreateOrder', { orderId: order._id || order.id })}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.tableText}>Mesa {order.table?.number || order.table}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                </View>
              </View>

              <View style={styles.orderBody}>
                <Text style={styles.itemsLabel}>Productos:</Text>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <View key={item._id || item.id || item.name} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItems}>Sin productos</Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
                <Text style={styles.dateText}>
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  kpiLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  ordersContainer: {
    gap: SPACING.md,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tableText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  orderBody: {
    marginBottom: SPACING.md,
  },
  itemsLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  itemName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  noItems: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  totalText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
});

export default OrdersList;
