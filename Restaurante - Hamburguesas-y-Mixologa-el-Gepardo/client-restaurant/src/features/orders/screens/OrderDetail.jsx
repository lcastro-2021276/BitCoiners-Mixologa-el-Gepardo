// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\orders\screens\OrderDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useOrders } from '../hooks/useOrders.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const OrderDetail = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const { fetchOrderById, cancelOrder, loading } = useOrders();

  const loadOrder = useCallback(async () => {
    const result = await fetchOrderById(orderId);
    if (result.success) {
      setOrder(result.data);
    }
  }, [fetchOrderById, orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return COLORS.warning;
      case 'preparacion':
        return COLORS.primary;
      case 'en_camino':
        return COLORS.secondary;
      case 'entregado':
        return COLORS.success;
      case 'cancelado':
        return COLORS.error;
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
      case 'en_camino':
        return 'En Camino';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'table':
        return 'En Mesa';
      case 'delivery':
        return 'A Domicilio';
      case 'takeout':
        return 'Para Llevar';
      default:
        return type;
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'table':
        return 'table-restaurant';
      case 'delivery':
        return 'delivery-dining';
      case 'takeout':
        return 'takeout-dining';
      default:
        return 'receipt';
    }
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      'Cancelar Pedido',
      '¿Estás seguro de cancelar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelOrder(orderId);
            if (result.success) {
              Alert.alert('Éxito', 'Pedido cancelado correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Error al cancelar pedido');
            }
          },
        },
      ]
    );
  };

  const isCancellable = (status) => {
    return status === 'pendiente';
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'pendiente', label: 'Pendiente', icon: 'receipt-long' },
      { key: 'preparacion', label: 'En Preparación', icon: 'restaurant' },
      { key: 'en_camino', label: 'En Camino', icon: 'local-shipping' },
      { key: 'entregado', label: 'Entregado', icon: 'check-circle' },
    ];

    const statusOrder = ['pendiente', 'preparacion', 'en_camino', 'entregado'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && status !== 'cancelado',
      current: index === currentIndex && status !== 'cancelado',
    }));
  };

  if (!order) {
    return <LoadingSpinner />;
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Order Status Header */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <MaterialIcons 
                name={getOrderTypeIcon(order.orderType)} 
                size={32} 
                color={getStatusColor(order.status)} 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.orderType}>{getOrderTypeLabel(order.orderType)}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Status Tracking */}
        <Card style={styles.trackingCard}>
          <Text style={styles.sectionTitle}>Seguimiento del Pedido</Text>
          <View style={styles.trackingContainer}>
            {statusSteps.map((step, index) => (
              <View key={step.key} style={styles.stepContainer}>
                <View style={styles.stepLineContainer}>
                  <View style={[
                    styles.stepDot,
                    step.completed && styles.stepDotCompleted,
                    step.current && styles.stepDotCurrent,
                  ]}>
                    {step.completed ? (
                      <MaterialIcons name="check" size={16} color={COLORS.surface} />
                    ) : (
                      <MaterialIcons name={step.icon} size={16} color={step.current ? COLORS.surface : COLORS.secondary} />
                    )}
                  </View>
                  {index < statusSteps.length - 1 && (
                    <View style={[
                      styles.stepLine,
                      step.completed && styles.stepLineCompleted,
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  step.completed && styles.stepLabelCompleted,
                  step.current && styles.stepLabelCurrent,
                ]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Order Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información del Pedido</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID del Pedido:</Text>
            <Text style={styles.infoValue}>#{order._id || order.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          {order.orderType === 'table' && order.table && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mesa:</Text>
              <Text style={styles.infoValue}>Mesa {order.table}</Text>
            </View>
          )}
          {order.orderType === 'delivery' && order.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{order.address}</Text>
            </View>
          )}
          {order.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{order.phone}</Text>
            </View>
          )}
          {order.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notas:</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          )}
        </Card>

        {/* Order Items */}
        <Card style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <View style={styles.itemsList}>
            {order.items && order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              ${(order.total - (order.deliveryFee || 0)).toFixed(2)}
            </Text>
          </View>
          {order.deliveryFee && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Envío:</Text>
              <Text style={styles.totalValue}>${order.deliveryFee.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.finalTotalRow]}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </Card>

        {/* Actions */}
        {isCancellable(order.status) && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
            <MaterialIcons name="cancel" size={20} color={COLORS.error} />
            <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
          </TouchableOpacity>
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
  statusCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  orderType: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.surface,
  },
  trackingCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  trackingContainer: {
    gap: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  stepLineContainer: {
    alignItems: 'center',
    width: 24,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotCompleted: {
    backgroundColor: COLORS.success,
  },
  stepDotCurrent: {
    backgroundColor: COLORS.primary,
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.success,
  },
  stepLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    flex: 1,
  },
  stepLabelCompleted: {
    color: COLORS.success,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  infoCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  notesContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  itemsCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  itemsList: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  itemQuantity: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  finalTotalRow: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  finalTotalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  finalTotalValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: '#fee2e2',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default OrderDetail;
