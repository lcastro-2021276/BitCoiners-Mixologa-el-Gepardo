// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\components\common\Common.jsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme.js';

export const LoadingSpinner = ({ size = 'large', color }) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size={size} color={color || COLORS.primary} />
    </View>
  );
};

export const EmptyState = ({ message, icon }) => {
  return (
    <View style={styles.emptyContainer}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

export const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export { default as Rating } from './Rating.jsx';

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
});
