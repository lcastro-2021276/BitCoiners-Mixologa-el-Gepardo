// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\components\common\SkeletonLoader.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme.js';

const SkeletonLoader = ({ style }) => {
  return <View style={[styles.skeleton, style]} />;
};

const CardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={[styles.skeleton, styles.image]} />
      <View style={styles.content}>
        <SkeletonLoader style={styles.title} />
        <SkeletonLoader style={styles.text} />
        <SkeletonLoader style={styles.textShort} />
      </View>
    </View>
  );
};

const ListSkeleton = ({ count = 3 }) => {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={`skeleton-card-${index}`} />
      ))}
    </View>
  );
};

const KPISkeleton = () => {
  return (
    <View style={styles.kpiContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={`skeleton-kpi-${index}`} style={styles.kpi}>
          <SkeletonLoader style={styles.kpiValue} />
          <SkeletonLoader style={styles.kpiLabel} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  image: {
    height: 120,
    marginBottom: SPACING.md,
  },
  content: {
    gap: SPACING.sm,
  },
  title: {
    height: 24,
    width: '70%',
  },
  text: {
    height: 16,
    width: '90%',
  },
  textShort: {
    height: 16,
    width: '50%',
  },
  list: {
    gap: SPACING.md,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  kpi: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  kpiValue: {
    height: 32,
    width: 60,
  },
  kpiLabel: {
    height: 16,
    width: 80,
  },
});

export { SkeletonLoader, CardSkeleton, ListSkeleton, KPISkeleton };
