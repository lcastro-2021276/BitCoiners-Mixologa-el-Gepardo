// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\screens\TablesList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { useTables } from '../hooks/useTables.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';
import { isAvailable, getAvailabilityColors, getAvailabilityLabel } from '../../../shared/utils/availabilityHelper.js';

const TablesList = ({ navigation }) => {
  const [tables, setTables] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'unavailable'
  const { fetchTables, loading, error } = useTables();

  const loadTables = useCallback(async () => {
    const result = await fetchTables();
    if (result.success) {
      setTables(result.data);
    }
  }, [fetchTables]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTables();
    setRefreshing(false);
  }, [loadTables]);

  const filteredTables = tables.filter((table) => {
    if (filter === 'all') return true;
    if (filter === 'available') return isAvailable(table);
    if (filter === 'unavailable') return !isAvailable(table);
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return COLORS.success;
      case 'ocupada':
        return COLORS.error;
      case 'reservada':
        return COLORS.warning;
      default:
        return COLORS.secondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'ocupada':
        return 'Ocupada';
      case 'reservada':
        return 'Reservada';
      default:
        return status;
    }
  };

  if (loading && tables.length === 0) {
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
        <Text style={styles.title}>Mesas</Text>
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

      {tables.length === 0 ? (
        <EmptyState message="No hay mesas registradas" icon={<MaterialIcons name="table-restaurant" size={48} color={COLORS.secondary} />} />
      ) : (
        <View style={styles.tablesList}>
          {filteredTables.map((table) => {
            const available = isAvailable(table);
            const colors = getAvailabilityColors(table);
            const availabilityLabel = getAvailabilityLabel(table);

            return (
              <TouchableOpacity
                key={table._id || table.id || table.number || JSON.stringify(table)}
                style={[
                  styles.tableCard,
                  !available && styles.tableCardUnavailable,
                  !available && { borderColor: colors.border, borderWidth: 2 }
                ]}
                onPress={() => available && navigation.navigate('TableDetail', { tableId: table._id || table.id })}
                disabled={!available}
                activeOpacity={0.7}
              >
                <View style={styles.tableImageContainer}>
                  <View style={[styles.tableImageGradient, !available && styles.tableImageGradientUnavailable]}>
                    <MaterialIcons
                      name="table-restaurant"
                      size={48}
                      color={!available ? COLORS.unavailableText : COLORS.primary}
                    />
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(table.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(table.status)}</Text>
                  </View>
                </View>
                <View style={styles.tableContent}>
                  <Text style={[styles.tableNumber, !available && styles.tableNumberUnavailable]}>
                    Mesa {table.number}
                  </Text>
                  <View style={styles.tableMeta}>
                    <MaterialIcons name="people" size={16} color={COLORS.textLight} />
                    <Text style={[styles.tableCapacity, !available && styles.tableCapacityUnavailable]}>
                      {table.capacity} personas
                    </Text>
                  </View>
                  {table.location && (
                    <View style={styles.tableMeta}>
                      <MaterialIcons name="place" size={16} color={COLORS.textLight} />
                      <Text style={[styles.tableLocation, !available && styles.tableLocationUnavailable]}>
                        {table.location}
                      </Text>
                    </View>
                  )}
                  {!available && (
                    <Text style={styles.unavailableLabel}>{availabilityLabel}</Text>
                  )}
                </View>
                <View style={styles.tableArrow}>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={!available ? COLORS.unavailableText : COLORS.primary}
                  />
                </View>
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
  tablesList: {
    gap: SPACING.md,
  },
  tableCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  tableImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  tableImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
  },
  tableImageGradientUnavailable: {
    backgroundColor: '#2A2A2A',
  },
  statusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  tableContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  tableNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tableMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tableCapacity: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  tableLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  tableArrow: {
    justifyContent: 'center',
    paddingRight: SPACING.md,
    paddingLeft: SPACING.sm,
  },
  unavailableLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  tableCardUnavailable: {
    backgroundColor: COLORS.unavailableBackground,
    opacity: 0.8,
  },
  tableNumberUnavailable: {
    color: COLORS.unavailableText,
  },
  tableCapacityUnavailable: {
    color: COLORS.unavailableText,
  },
  tableLocationUnavailable: {
    color: COLORS.unavailableText,
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
    borderRadius: 12,
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

export default TablesList;
