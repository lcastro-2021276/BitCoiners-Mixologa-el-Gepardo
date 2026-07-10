// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\home\screens\Home.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card } from '../../../shared/components/common/Common.jsx';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';
import useAuthStore from '../../../shared/store/authStore.js';

const Home = ({ navigation }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const quickActions = [
    {
      id: 'tables',
      title: 'Mesas',
      icon: 'table-restaurant',
      color: COLORS.primary,
      screen: 'Mesas',
      adminOnly: true,
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: 'receipt-long',
      color: COLORS.success,
      screen: 'Pedidos',
    },
    {
      id: 'menu',
      title: 'Menú',
      icon: 'restaurant-menu',
      color: COLORS.warning,
      screen: 'Menú',
      adminOnly: true,
    },
    {
      id: 'profile',
      title: 'Perfil',
      icon: 'person',
      color: COLORS.secondary,
      screen: 'Perfil',
    },
  ].filter(action => !action.adminOnly || isAdmin);

  const stats = [
    {
      id: 'orders',
      title: 'Pedidos Hoy',
      value: '12',
      icon: 'receipt-long',
      color: COLORS.primary,
    },
    {
      id: 'tables',
      title: 'Mesas Ocupadas',
      value: '8',
      icon: 'table-restaurant',
      color: COLORS.success,
    },
    {
      id: 'rating',
      title: 'Rating',
      value: '4.8',
      icon: 'star',
      color: COLORS.warning,
    },
  ];

  const specials = [
    {
      id: 1,
      title: 'Hamburguesa Gepardo',
      description: 'Nuestra especialidad con queso fundido y bacon crujiente',
      price: '$12.99',
      originalPrice: '$15.99',
      icon: 'lunch-dining',
      badge: 'Popular',
    },
    {
      id: 2,
      title: 'Cóctel de la Casa',
      description: 'Mixología exclusiva preparada al momento',
      price: '$8.99',
      originalPrice: '$10.99',
      icon: 'local-bar',
      badge: 'Nuevo',
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Image
            source={require('../../../../assets/mixologias.png')}
            style={styles.welcomeImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Bienvenido de nuevo</Text>
              <Text style={styles.restaurantName}>El Gepardo</Text>
              <Text style={styles.welcomeSubtitle}>Hamburguesas & Mixología Premium</Text>
              <View style={styles.userBadge}>
                <MaterialIcons name="person" size={16} color={COLORS.surface} />
                <Text style={styles.userBadgeText}>{user?.name || 'Cliente'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionGradient, { backgroundColor: action.color }]}>
                  <MaterialIcons name={action.icon} size={32} color={COLORS.surface} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Especiales del Día</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Menú')}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          {specials.map((special) => (
            <TouchableOpacity key={special.id} activeOpacity={0.7}>
              <Card style={styles.specialCard}>
                <View style={styles.specialBadge}>
                  <Text style={styles.specialBadgeText}>{special.badge}</Text>
                </View>
                <View style={styles.specialContent}>
                  <View style={[styles.specialIcon, { backgroundColor: COLORS.primary + '15' }]}>
                    <MaterialIcons name={special.icon} size={32} color={COLORS.primary} />
                  </View>
                  <View style={styles.specialInfo}>
                    <Text style={styles.specialTitle}>{special.title}</Text>
                    <Text style={styles.specialDescription} numberOfLines={2}>
                      {special.description}
                    </Text>
                    <View style={styles.specialPriceContainer}>
                      <Text style={styles.specialPrice}>{special.price}</Text>
                      <Text style={styles.specialOriginalPrice}>{special.originalPrice}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={COLORS.secondary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <View style={[styles.infoIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Horario</Text>
                <Text style={styles.infoSubtitle}>Lun - Dom: 12:00 PM - 11:00 PM</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <View style={[styles.infoIcon, { backgroundColor: COLORS.success + '15' }]}>
                <MaterialIcons name="location-on" size={24} color={COLORS.success} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Ubicación</Text>
                <Text style={styles.infoSubtitle}>Zona 10, Ciudad de Guatemala</Text>
              </View>
            </View>
          </Card>
        </View>
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
    padding: SPACING.lg,
  },
  welcomeBanner: {
    position: 'relative',
    height: 280,
    borderRadius: 24,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.xl,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.surface + 'CC',
    marginBottom: SPACING.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.surface + 'EE',
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  userBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.surface,
  },
  welcomeIcon: {
    marginLeft: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  seeAllText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  specialCard: {
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    position: 'relative',
  },
  specialBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  specialBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.surface,
  },
  specialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  specialIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  specialInfo: {
    flex: 1,
  },
  specialTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  specialDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  specialPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  specialPrice: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  specialOriginalPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    ...SHADOWS.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '15',
    padding: SPACING.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  infoSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default Home;
