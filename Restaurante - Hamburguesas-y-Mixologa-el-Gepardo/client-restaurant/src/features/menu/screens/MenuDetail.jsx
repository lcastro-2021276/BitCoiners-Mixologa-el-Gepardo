// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\menu\screens\MenuDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useMenu } from '../hooks/useMenu.js';

const MenuDetail = ({ route, navigation }) => {
  const { itemId } = route.params || {};
  const [menuItem, setMenuItem] = useState(null);
  const { updateMenuItem, deleteMenuItem, loading } = useMenu();

  const loadMenuItem = useCallback(async () => {
    const { fetchMenuItems } = await import('../hooks/useMenu.js');
    const { fetchMenuItems: fetch } = useMenu();
    const result = await fetch();
    if (result.success) {
      const item = result.data.find((i) => i.id === itemId);
      setMenuItem(item);
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId) {
      loadMenuItem();
    }
  }, [itemId, loadMenuItem]);

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Item',
      '¿Estás seguro de eliminar este item del menú?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteMenuItem(itemId);
            if (result.success) {
              Alert.alert('Éxito', 'Item eliminado correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Error al eliminar item');
            }
          },
        },
      ]
    );
  };

  if (!menuItem) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="restaurant" size={80} color={COLORS.secondary} />
      </View>

      <Card style={styles.detailCard}>
        <View style={styles.header}>
          <Text style={styles.name}>{menuItem.name}</Text>
          {!menuItem.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>No disponible</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{menuItem.description || 'Sin descripción'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurante</Text>
          <Text style={styles.restaurant}>{menuItem.restaurant || 'No especificado'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidad</Text>
          <Text style={[styles.status, menuItem.available ? styles.available : styles.unavailable]}>
            {menuItem.available ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('CreateMenuItem', { itemId })}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Eliminar"
          onPress={handleDelete}
          loading={loading}
          style={styles.actionButton}
        />
      </View>
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
  imagePlaceholder: {
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  detailCard: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  unavailableText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  price: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  restaurant: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  status: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.error,
  },
  actions: {
    gap: SPACING.md,
  },
  actionButton: {
    marginTop: 0,
  },
});

export default MenuDetail;
