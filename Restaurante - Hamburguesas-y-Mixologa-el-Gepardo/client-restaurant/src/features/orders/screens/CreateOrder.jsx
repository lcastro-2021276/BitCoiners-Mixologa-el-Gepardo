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
  const [orderType, setOrderType] = useState('table'); // 'table', 'delivery', 'takeout'

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      table: '',
      productId: '',
      quantity: 1,
      address: '',
      phone: '',
      notes: '',
    },
  });

  const table = watch('table');
  const productId = watch('productId');
  const quantity = watch('quantity');
  const address = watch('address');
  const phone = watch('phone');
  const notes = watch('notes');

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

    const orderData = {
      items: selectedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: 'pendiente',
      orderType,
    };

    if (orderType === 'table') {
      if (!data.table) {
        Alert.alert('Error', 'Selecciona una mesa');
        return;
      }
      orderData.table = parseInt(data.table);
    } else if (orderType === 'delivery') {
      if (!data.address) {
        Alert.alert('Error', 'Ingresa la dirección de entrega');
        return;
      }
      if (!data.phone) {
        Alert.alert('Error', 'Ingresa el teléfono de contacto');
        return;
      }
      orderData.address = data.address;
      orderData.phone = data.phone;
      orderData.deliveryFee = 25.00; // Delivery fee
      orderData.total += orderData.deliveryFee;
    } else if (orderType === 'takeout') {
      if (!data.phone) {
        Alert.alert('Error', 'Ingresa el teléfono de contacto');
        return;
      }
      orderData.phone = data.phone;
    }

    if (data.notes) {
      orderData.notes = data.notes;
    }

    const result = await createOrder(orderData);
    if (result.success) {
      Alert.alert('Éxito', 'Pedido creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Pedidos'),
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
        <Text style={styles.sectionTitle}>Tipo de Pedido</Text>
        <View style={styles.orderTypeContainer}>
          <TouchableOpacity
            style={[styles.orderTypeButton, orderType === 'table' && styles.orderTypeButtonActive]}
            onPress={() => setOrderType('table')}
          >
            <MaterialIcons name="table-restaurant" size={24} color={orderType === 'table' ? COLORS.surface : COLORS.primary} />
            <Text style={[styles.orderTypeText, orderType === 'table' && styles.orderTypeTextActive]}>En Mesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.orderTypeButton, orderType === 'delivery' && styles.orderTypeButtonActive]}
            onPress={() => setOrderType('delivery')}
          >
            <MaterialIcons name="delivery-dining" size={24} color={orderType === 'delivery' ? COLORS.surface : COLORS.primary} />
            <Text style={[styles.orderTypeText, orderType === 'delivery' && styles.orderTypeTextActive]}>A Domicilio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.orderTypeButton, orderType === 'takeout' && styles.orderTypeButtonActive]}
            onPress={() => setOrderType('takeout')}
          >
            <MaterialIcons name="takeout-dining" size={24} color={orderType === 'takeout' ? COLORS.surface : COLORS.primary} />
            <Text style={[styles.orderTypeText, orderType === 'takeout' && styles.orderTypeTextActive]}>Para Llevar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {orderType === 'table' && (
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
      )}

      {(orderType === 'delivery' || orderType === 'takeout') && (
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            {orderType === 'delivery' ? 'Información de Entrega' : 'Información de Recogida'}
          </Text>
          {orderType === 'delivery' && (
            <Input
              label="Dirección de Entrega"
              name="address"
              control={control}
              rules={{ required: 'La dirección es requerida' }}
              placeholder="Calle, número, colonia"
            />
          )}
          <Input
            label="Teléfono de Contacto"
            name="phone"
            control={control}
            rules={{ required: 'El teléfono es requerido' }}
            placeholder="+52 55 1234 5678"
            keyboardType="phone-pad"
          />
          <Input
            label="Notas Adicionales (Opcional)"
            name="notes"
            control={control}
            placeholder="Instrucciones especiales"
            multiline
            numberOfLines={3}
          />
          {orderType === 'delivery' && (
            <View style={styles.deliveryFeeContainer}>
              <MaterialIcons name="local-shipping" size={20} color={COLORS.primary} />
              <Text style={styles.deliveryFeeText}>Costo de envío: $25.00</Text>
            </View>
          )}
        </Card>
      )}

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
  orderTypeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  orderTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  orderTypeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderTypeTextActive: {
    color: COLORS.surface,
  },
  deliveryFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  deliveryFeeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default CreateOrder;
