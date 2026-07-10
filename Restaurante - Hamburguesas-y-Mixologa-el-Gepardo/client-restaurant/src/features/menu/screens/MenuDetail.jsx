// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\menu\screens\MenuDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useMenu } from '../hooks/useMenu.js';
import useAuthStore from '../../../shared/store/authStore.js';

const MenuDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params || {};
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchMenuItems, updateMenuItem, deleteMenuItem } = useMenu();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        setLoading(true);
        const result = await fetchMenuItems();
        if (result.success && result.data) {
          const item = result.data.find((i) => i.id === itemId);
          setMenuItem(item || null);
        }
      } catch (error) {
        console.error('Error loading menu item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadMenuItem();
    } else {
      setLoading(false);
    }
  }, [itemId, fetchMenuItems]);

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

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>
          {menuItem.available && (
            <View style={styles.availableBadge}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.availableText}>Disponible</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{menuItem.description || 'Sin descripción'}</Text>
        </View>

        <Card style={styles.restaurantCard}>
          <View style={styles.restaurantHeader}>
            <MaterialIcons name="store" size={24} color={COLORS.primary} />
            <Text style={styles.restaurantTitle}>Información del Restaurante</Text>
          </View>
          
          <View style={styles.restaurantInfo}>
            <View style={styles.infoRow}>
              <MaterialIcons name="business" size={20} color={COLORS.secondary} />
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{menuItem.restaurant || 'Gepardo Hamburguesas & Mixología'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color={COLORS.secondary} />
              <Text style={styles.infoLabel}>Ubicación:</Text>
              <Text style={styles.infoValue}>Zona 10, Ciudad de Guatemala</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={20} color={COLORS.secondary} />
              <Text style={styles.infoLabel}>Horario:</Text>
              <Text style={styles.infoValue}>Lun-Dom: 11:00 AM - 11:00 PM</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={20} color={COLORS.secondary} />
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>+502 2222-2222</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>
          <View style={styles.categoryBadge}>
            <MaterialIcons name="fastfood" size={16} color={COLORS.primary} />
            <Text style={styles.categoryText}>Hamburguesas</Text>
          </View>
        </View>
      </Card>

      {!isAdmin && (
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigation.navigate('CreateOrder')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="shopping-cart" size={28} color={COLORS.surface} />
          <View style={styles.orderButtonTextContainer}>
            <Text style={styles.orderButtonTitle}>¿Te interesa probarlo?</Text>
            <Text style={styles.orderButtonSubtitle}>Haz tu pedido</Text>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      )}

      {isAdmin && (
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
      )}
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
    backgroundColor: COLORS.primary + '10',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
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
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    flex: 1,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.surface,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  price: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  availableText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.success,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    lineHeight: 24,
  },
  restaurantCard: {
    backgroundColor: COLORS.primary + '05',
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
    marginBottom: SPACING.lg,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '20',
  },
  restaurantTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  restaurantInfo: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textLight,
    minWidth: 80,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  orderButtonTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  orderButtonTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.surface,
  },
  orderButtonSubtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.surface + 'CC',
  },
  actions: {
    gap: SPACING.md,
  },
  actionButton: {
    marginTop: 0,
  },
});

export default MenuDetail;
