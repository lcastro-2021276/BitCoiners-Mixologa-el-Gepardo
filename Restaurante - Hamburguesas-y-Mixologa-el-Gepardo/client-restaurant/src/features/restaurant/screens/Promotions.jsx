// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\restaurant\screens\Promotions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const Promotions = ({ navigation }) => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: '2x1 en Hamburguesas',
      description: 'Lleva dos hamburguesas clásicas por el precio de uno. Válido todos los lunes.',
      discount: '50%',
      validUntil: '2024-12-31',
      type: 'promotion',
      image: 'lunch-dining',
      terms: 'No acumulable con otras promociones. Válido solo para consumo en local.',
    },
    {
      id: 2,
      title: 'Cóctel Feliz',
      description: 'Cócteles de la casa con 20% de descuento de 6:00 PM a 8:00 PM.',
      discount: '20%',
      validUntil: '2024-12-31',
      type: 'promotion',
      image: 'local-bar',
      terms: 'Válido solo de lunes a viernes. No aplica para cócteles premium.',
    },
    {
      id: 3,
      title: 'Cupon de Bienvenida',
      description: '¡Nuevo cliente! Obtén $50 de descuento en tu primera orden.',
      discount: '$50',
      validUntil: '2024-12-31',
      type: 'coupon',
      image: 'card-giftcard',
      code: 'BIENVENIDO50',
      terms: 'Mínimo de compra $200. Válido para primera orden.',
    },
    {
      id: 4,
      title: 'Noche de Música en Vivo',
      description: 'Viernes y sábados disfruta de música en vivo sin costo adicional.',
      discount: 'GRATIS',
      validUntil: '2024-12-31',
      type: 'event',
      image: 'music-note',
      terms: 'Reservación recomendada. Horario: 8:00 PM - 11:00 PM.',
    },
    {
      id: 5,
      title: 'Combo Pareja',
      description: '2 hamburguesas + 2 bebidas + papas para compartir por $199.',
      discount: '$199',
      validUntil: '2024-12-31',
      type: 'promotion',
      image: 'favorite',
      terms: 'Válido solo para consumo en local.',
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'promotion', 'coupon', 'event'

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredPromotions = promotions.filter((promo) => {
    if (filter === 'all') return true;
    return promo.type === filter;
  });

  const getIconForType = (type, imageName) => {
    return imageName;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'promotion':
        return COLORS.primary;
      case 'coupon':
        return COLORS.success;
      case 'event':
        return COLORS.warning;
      default:
        return COLORS.secondary;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'promotion':
        return 'Promoción';
      case 'coupon':
        return 'Cupón';
      case 'event':
        return 'Evento';
      default:
        return type;
    }
  };

  const copyCouponCode = (code) => {
    // In a real app, this would copy to clipboard
    alert(`Cupón copiado: ${code}`);
  };

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
          <Text style={styles.title}>Promociones y Eventos</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'promotion' && styles.filterButtonActive]}
            onPress={() => setFilter('promotion')}
          >
            <Text style={[styles.filterText, filter === 'promotion' && styles.filterTextActive]}>Promociones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'coupon' && styles.filterButtonActive]}
            onPress={() => setFilter('coupon')}
          >
            <Text style={[styles.filterText, filter === 'coupon' && styles.filterTextActive]}>Cupones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'event' && styles.filterButtonActive]}
            onPress={() => setFilter('event')}
          >
            <Text style={[styles.filterText, filter === 'event' && styles.filterTextActive]}>Eventos</Text>
          </TouchableOpacity>
        </View>

        {filteredPromotions.length === 0 ? (
          <EmptyState 
            message="No hay promociones disponibles" 
            icon={<MaterialIcons name="local-offer" size={48} color={COLORS.secondary} />} 
          />
        ) : (
          <View style={styles.promotionsContainer}>
            {filteredPromotions.map((promo) => (
              <Card key={promo.id} style={styles.promoCard}>
                <View style={styles.promoHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: getTypeColor(promo.type) + '20' }]}>
                    <MaterialIcons 
                      name={getIconForType(promo.type, promo.image)} 
                      size={32} 
                      color={getTypeColor(promo.type)} 
                    />
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(promo.type) }]}>
                    <Text style={styles.typeText}>{getTypeLabel(promo.type)}</Text>
                  </View>
                </View>

                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoDescription}>{promo.description}</Text>

                <View style={styles.promoDetails}>
                  <View style={styles.discountContainer}>
                    <MaterialIcons name="local-offer" size={20} color={COLORS.success} />
                    <Text style={styles.discountValue}>{promo.discount}</Text>
                  </View>
                  <View style={styles.validContainer}>
                    <MaterialIcons name="event" size={20} color={COLORS.textLight} />
                    <Text style={styles.validText}>Válido hasta: {new Date(promo.validUntil).toLocaleDateString('es-ES')}</Text>
                  </View>
                </View>

                {promo.code && (
                  <TouchableOpacity 
                    style={styles.couponCodeContainer}
                    onPress={() => copyCouponCode(promo.code)}
                  >
                    <Text style={styles.couponLabel}>Código:</Text>
                    <Text style={styles.couponCode}>{promo.code}</Text>
                    <MaterialIcons name="content-copy" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                )}

                <View style={styles.termsContainer}>
                  <MaterialIcons name="info" size={16} color={COLORS.textLight} />
                  <Text style={styles.termsText}>{promo.terms}</Text>
                </View>
              </Card>
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
  filterContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
  filterButton: {
    flex: 1,
    minWidth: '22%',
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
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.surface,
  },
  promotionsContainer: {
    gap: SPACING.md,
  },
  promoCard: {
    padding: SPACING.lg,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  promoTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  promoDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  promoDetails: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  discountValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.success,
  },
  validContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  validText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  couponLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  couponCode: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
    letterSpacing: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
  },
  termsText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    lineHeight: 16,
  },
});

export default Promotions;
