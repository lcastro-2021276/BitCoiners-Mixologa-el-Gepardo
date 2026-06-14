// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\home\screens\Home.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card } from '../../../shared/components/common/Common.jsx';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const Home = ({ navigation }) => {
  const quickActions = [
    {
      id: 'tables',
      title: 'Mesas',
      icon: 'table-restaurant',
      color: COLORS.primary,
      screen: 'Mesas',
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
    },
    {
      id: 'profile',
      title: 'Perfil',
      icon: 'person',
      color: COLORS.secondary,
      screen: 'Perfil',
    },
  ];

  const specials = [
    {
      id: 1,
      title: 'Hamburguesa Gepardo',
      description: 'Nuestra especialidad con queso fundido y bacon',
      price: '$12.99',
      icon: 'lunch-dining',
    },
    {
      id: 2,
      title: 'Cóctel de la Casa',
      description: 'Mixología exclusiva preparada al momento',
      price: '$8.99',
      icon: 'local-bar',
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
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Bienvenido a</Text>
            <Text style={styles.restaurantName}>El Gepardo</Text>
            <Text style={styles.welcomeSubtitle}>Hamburguesas & Mixología</Text>
          </View>
          <MaterialIcons name="restaurant" size={60} color={COLORS.primary} />
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
                <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                  <MaterialIcons name={action.icon} size={32} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especiales del Día</Text>
          {specials.map((special) => (
            <Card key={special.id} style={styles.specialCard}>
              <View style={styles.specialContent}>
                <View style={[styles.specialIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <MaterialIcons name={special.icon} size={28} color={COLORS.primary} />
                </View>
                <View style={styles.specialInfo}>
                  <Text style={styles.specialTitle}>{special.title}</Text>
                  <Text style={styles.specialDescription}>{special.description}</Text>
                  <Text style={styles.specialPrice}>{special.price}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Horario de Atención</Text>
              <Text style={styles.infoSubtitle}>Lun - Dom: 12:00 PM - 11:00 PM</Text>
            </View>
          </View>
        </Card>
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
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  restaurantName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  specialCard: {
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  specialContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
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
    marginBottom: SPACING.xs,
  },
  specialPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: COLORS.primary + '08',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});

export default Home;
