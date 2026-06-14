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
        <View style={styles.tablesGrid}>
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
              >
                <View style={styles.tableHeader}>
                  <MaterialIcons 
                    name="table-restaurant" 
                    size={40} 
                    color={!available ? COLORS.unavailableText : COLORS.primary} 
                  />
                  {!available ? (
                    <View style={[styles.statusBadge, { backgroundColor: colors.badge }]}>
                      <Text style={styles.statusText}>Fuera de servicio</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(table.status) }]}>
                      <Text style={styles.statusText}>{getStatusLabel(table.status)}</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.tableNumber,
                  !available && styles.tableNumberUnavailable
                ]}>Mesa {table.number}</Text>
                <Text style={[
                  styles.tableCapacity,
                  !available && styles.tableCapacityUnavailable
                ]}>Capacidad: {table.capacity} personas</Text>
                {table.location && (
                  <Text style={[
                    styles.tableLocation,
                    !available && styles.tableLocationUnavailable
                  ]}>{table.location}</Text>
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
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  tableCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  tableNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tableCapacity: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  tableLocation: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
  },
  tableCardUnavailable: {
    backgroundColor: COLORS.unavailableBackground,
    opacity: 0.7,
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

export default TablesList;
