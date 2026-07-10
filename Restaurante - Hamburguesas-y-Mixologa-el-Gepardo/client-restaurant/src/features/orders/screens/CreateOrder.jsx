// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\orders\screens\CreateOrder.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useOrders } from '../hooks/useOrders.js';

const CreateOrder = () => {
  const navigation = useNavigation();
  const { createOrder, loading, error } = useOrders();
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const menuItems = [
    { id: 1, name: 'Hamburguesa Clásica', price: 85.00, icon: 'restaurant' },
    { id: 2, name: 'Hamburguesa con Queso', price: 95.00, icon: 'restaurant' },
    { id: 3, name: 'Hamburguesa Doble', price: 120.00, icon: 'restaurant' },
    { id: 4, name: 'Papas Fritas', price: 35.00, icon: 'fastfood' },
    { id: 5, name: 'Refresco', price: 25.00, icon: 'local-drink' },
    { id: 6, name: 'Cerveza', price: 45.00, icon: 'local-bar' },
  ];

  const addItem = useCallback((product) => {
    const existingItem = selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      const newItems = selectedItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setSelectedItems(newItems);
      calculateTotal(newItems);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      setSelectedItems([...selectedItems, newItem]);
      calculateTotal([...selectedItems, newItem]);
    }
  }, [selectedItems]);

  const removeItem = useCallback((index) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
    calculateTotal(newItems);
  }, [selectedItems]);

  const updateQuantity = useCallback((index, delta) => {
    const newItems = selectedItems.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setSelectedItems(newItems);
    calculateTotal(newItems);
  }, [selectedItems]);

  const calculateTotal = useCallback((items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, []);

  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto al pedido');
      return;
    }

    Alert.alert(
      'Realizar Pedido',
      '¿Estás seguro de realizar su pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          style: 'default',
          onPress: async () => {
            const orderData = {
              items: selectedItems.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              total,
              status: 'pendiente',
              orderType: 'table',
            };

            const result = await createOrder(orderData);
            if (result.success) {
              Alert.alert('Pedido realizado con éxito', 'Tu pedido ha sido enviado a cocina', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('OrdersList'),
                },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Error al realizar pedido');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Pedido</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Menú</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItemCard}
              onPress={() => addItem(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <MaterialIcons name={item.icon} size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemPrice}>Q{item.price.toFixed(2)}</Text>
              <View style={styles.addButton}>
                <MaterialIcons name="add" size={20} color={COLORS.surface} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedItems.length > 0 && (
          <Card style={styles.invoiceCard}>
            <Text style={styles.sectionTitle}>Factura</Text>
            {selectedItems.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.invoiceItem}>
                <View style={styles.invoiceItemInfo}>
                  <Text style={styles.invoiceItemName}>{item.name}</Text>
                  <Text style={styles.invoiceItemPrice}>Q{item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.invoiceItemActions}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(index, -1)}
                  >
                    <MaterialIcons name="remove" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(index, 1)}
                  >
                    <MaterialIcons name="add" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(index)}
                  >
                    <MaterialIcons name="delete" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemSubtotal}>
                  Subtotal: Q{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>Q{total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.createOrderButton}
              onPress={handleCreateOrder}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <MaterialIcons name="shopping-cart" size={24} color={COLORS.surface} />
                  <Text style={styles.createOrderButtonText}>Realizar Pedido</Text>
                </>
              )}
            </TouchableOpacity>
          </Card>
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
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    ...SHADOWS.md,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  errorCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '20',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  menuItemCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  menuItemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  menuItemPrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  invoiceCard: {
    borderRadius: 20,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  invoiceItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  invoiceItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  invoiceItemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  invoiceItemPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  invoiceItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quantityText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSubtotal: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  totalLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  createOrderButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    marginTop: SPACING.lg,
    ...SHADOWS.lg,
  },
  createOrderButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});

export default CreateOrder;
