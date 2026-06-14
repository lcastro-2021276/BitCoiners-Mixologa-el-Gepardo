// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\orders\screens\CreateOrder.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useOrders } from '../hooks/useOrders.js';

const CreateOrder = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const { createOrder, loading, error } = useOrders();
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      table: '',
      productId: '',
      quantity: 1,
    },
  });

  const table = watch('table');
  const productId = watch('productId');
  const quantity = watch('quantity');

  const menuItems = [
    { id: 1, name: 'Hamburguesa Clásica', price: 85.00 },
    { id: 2, name: 'Hamburguesa con Queso', price: 95.00 },
    { id: 3, name: 'Hamburguesa Doble', price: 120.00 },
    { id: 4, name: 'Papas Fritas', price: 35.00 },
    { id: 5, name: 'Refresco', price: 25.00 },
    { id: 6, name: 'Cerveza', price: 45.00 },
  ];

  const addItem = useCallback(() => {
    if (!productId || !quantity || quantity <= 0) {
      Alert.alert('Error', 'Selecciona un producto y cantidad válida');
      return;
    }

    const product = menuItems.find((item) => item.id === parseInt(productId));
    if (!product) {
      Alert.alert('Error', 'Producto no encontrado');
      return;
    }

    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity),
    };

    setSelectedItems([...selectedItems, newItem]);
    calculateTotal([...selectedItems, newItem]);
    setValue('productId', '');
    setValue('quantity', 1);
  }, [productId, quantity, selectedItems, menuItems, setValue]);

  const removeItem = useCallback((index) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
    calculateTotal(newItems);
  }, [selectedItems]);

  const calculateTotal = useCallback((items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, []);

  const onSubmit = async (data) => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto al pedido');
      return;
    }

    if (!data.table) {
      Alert.alert('Error', 'Selecciona una mesa');
      return;
    }

    const orderData = {
      table: parseInt(data.table),
      items: selectedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: 'pendiente',
    };

    const result = await createOrder(orderData);
    if (result.success) {
      Alert.alert('Éxito', 'Pedido creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al crear pedido');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>{orderId ? 'Editar Pedido' : 'Crear Pedido'}</Text>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Información de la Mesa</Text>
        <Input
          label="Número de Mesa"
          name="table"
          control={control}
          rules={{ required: 'El número de mesa es requerido' }}
          placeholder="Ej: 1"
          keyboardType="number-pad"
        />
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Agregar Productos</Text>
        <Input
          label="Producto"
          name="productId"
          control={control}
          rules={{ required: 'Selecciona un producto' }}
          placeholder="Selecciona un producto"
        />
        <Input
          label="Cantidad"
          name="quantity"
          control={control}
          rules={{ required: 'La cantidad es requerida', min: { value: 1, message: 'Mínimo 1' } }}
          placeholder="Cantidad"
          keyboardType="number-pad"
        />
        <Button title="Agregar Producto" onPress={addItem} variant="secondary" style={styles.addButton} />
      </Card>

      {selectedItems.length > 0 && (
        <Card style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Productos Agregados</Text>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.itemActions}>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
                  <MaterialIcons name="close" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </Card>
      )}

      <Button
        title={orderId ? 'Actualizar Pedido' : 'Crear Pedido'}
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  errorCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  addButton: {
    marginTop: SPACING.md,
  },
  itemsCard: {
    marginBottom: SPACING.md,
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
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  itemQuantity: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  totalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
});

export default CreateOrder;
