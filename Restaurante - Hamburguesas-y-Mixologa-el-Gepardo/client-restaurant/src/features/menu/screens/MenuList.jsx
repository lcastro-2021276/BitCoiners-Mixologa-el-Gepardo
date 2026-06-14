// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\menu\screens\MenuList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { useMenu } from '../hooks/useMenu.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';
import { isAvailable, getAvailabilityColors, getAvailabilityLabel } from '../../../shared/utils/availabilityHelper.js';

const MenuList = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'unavailable'
  const { fetchMenuItems, loading, error } = useMenu();

  const loadMenu = useCallback(async () => {
    const result = await fetchMenuItems();
    if (result.success) {
      setMenuItems(result.data);
    }
  }, [fetchMenuItems]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMenu();
    setRefreshing(false);
  }, [loadMenu]);

  const filteredItems = menuItems.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'available') return isAvailable(item);
    if (filter === 'unavailable') return !isAvailable(item);
    return true;
  });

  if (loading && menuItems.length === 0) {
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
        <Text style={styles.title}>Menú</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateMenuItem')}>
          <MaterialIcons name="add" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'available' && styles.filterButtonActive]}
          onPress={() => setFilter('available')}
        >
          <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>Disponibles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unavailable' && styles.filterButtonActive]}
          onPress={() => setFilter('unavailable')}
        >
          <Text style={[styles.filterText, filter === 'unavailable' && styles.filterTextActive]}>No disponibles</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      {menuItems.length === 0 ? (
        <EmptyState message="No hay items en el menú" icon={<MaterialIcons name="restaurant-menu" size={48} color={COLORS.secondary} />} />
      ) : (
        <View style={styles.menuGrid}>
          {filteredItems.map((item, index) => {
            const available = isAvailable(item);
            const colors = getAvailabilityColors(item);
            const availabilityLabel = getAvailabilityLabel(item);
            const itemKey = item.id || item._id || `${item.name}-${index}`;
            
            return (
              <TouchableOpacity
                key={itemKey}
                style={[
                  styles.menuCard,
                  !available && styles.menuCardUnavailable,
                  !available && { borderColor: colors.border, borderWidth: 2 }
                ]}
                onPress={() => available && navigation.navigate('MenuDetail', { itemId: item.id })}
                disabled={!available}
              >
                <View style={[
                  styles.imagePlaceholder,
                  !available && styles.imagePlaceholderUnavailable
                ]}>
                  <MaterialIcons 
                    name="restaurant" 
                    size={48} 
                    color={!available ? COLORS.unavailableText : COLORS.secondary} 
                  />
                </View>
                <View style={[
                  styles.menuInfo,
                  !available && styles.menuInfoUnavailable
                ]}>
                  <Text style={[
                    styles.itemName,
                    !available && styles.itemNameUnavailable
                  ]}>{item.name}</Text>
                  <Text style={[
                    styles.itemDescription,
                    !available && styles.itemDescriptionUnavailable
                  ]} numberOfLines={2}>
                    {item.description || 'Sin descripción'}
                  </Text>
                  {available ? (
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  ) : (
                    <Text style={styles.itemPriceUnavailable}>No disponible temporalmente</Text>
                  )}
                </View>
                {!available && (
                  <View style={[styles.unavailableBadge, { backgroundColor: colors.badge }]}>
                    <Text style={styles.unavailableText}>{availabilityLabel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
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
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  menuCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    padding: SPACING.md,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    minHeight: 36,
  },
  itemPrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  unavailableBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.unavailableBadge,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  unavailableText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  menuCardUnavailable: {
    backgroundColor: COLORS.unavailableBackground,
    opacity: 0.7,
  },
  imagePlaceholderUnavailable: {
    backgroundColor: '#2A2A2A',
  },
  menuInfoUnavailable: {
    opacity: 0.6,
  },
  itemNameUnavailable: {
    color: COLORS.unavailableText,
    textDecorationLine: 'line-through',
  },
  itemDescriptionUnavailable: {
    color: COLORS.unavailableText,
  },
  itemPriceUnavailable: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.unavailableText,
    fontStyle: 'italic',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.surface,
  },
});

export default MenuList;
