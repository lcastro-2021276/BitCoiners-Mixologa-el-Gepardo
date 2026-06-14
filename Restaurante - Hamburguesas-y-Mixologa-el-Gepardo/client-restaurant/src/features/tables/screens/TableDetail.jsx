// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\screens\TableDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useTables } from '../hooks/useTables.js';

const TableDetail = ({ route, navigation }) => {
  const { tableId } = route.params || {};
  const [table, setTable] = useState(null);
  const { updateTable, deleteTable, loading } = useTables();

  const loadTable = useCallback(async () => {
    const { fetchTables } = useTables();
    const result = await fetchTables();
    if (result.success) {
      const foundTable = result.data.find((t) => t.id === tableId);
      setTable(foundTable);
    }
  }, [tableId]);

  useEffect(() => {
    if (tableId) {
      loadTable();
    }
  }, [tableId, loadTable]);

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Mesa',
      '¿Estás seguro de eliminar esta mesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTable(tableId);
            if (result.success) {
              Alert.alert('Éxito', 'Mesa eliminada correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Error al eliminar mesa');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus) => {
    const result = await updateTable(tableId, { status: newStatus });
    if (result.success) {
      Alert.alert('Éxito', 'Estado actualizado correctamente');
      loadTable();
    } else {
      Alert.alert('Error', result.error || 'Error al actualizar estado');
    }
  };

  if (!table) {
    return <LoadingSpinner />;
  }

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="table-restaurant" size={80} color={COLORS.primary} />
      </View>

      <Card style={styles.detailCard}>
        <View style={styles.header}>
          <Text style={styles.tableNumber}>Mesa {table.number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(table.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(table.status)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capacidad</Text>
          <Text style={styles.sectionValue}>{table.capacity} personas</Text>
        </View>

        {table.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.sectionValue}>{table.location}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar Estado</Text>
          <View style={styles.statusButtons}>
            <Button
              title="Disponible"
              onPress={() => handleStatusChange('disponible')}
              variant={table.status === 'disponible' ? 'primary' : 'secondary'}
              style={styles.statusButton}
            />
            <Button
              title="Ocupada"
              onPress={() => handleStatusChange('ocupada')}
              variant={table.status === 'ocupada' ? 'primary' : 'secondary'}
              style={styles.statusButton}
            />
            <Button
              title="Reservada"
              onPress={() => handleStatusChange('reservada')}
              variant={table.status === 'reservada' ? 'primary' : 'secondary'}
              style={styles.statusButton}
            />
          </View>
        </View>
      </Card>

      <Button
        title="Eliminar Mesa"
        onPress={handleDelete}
        loading={loading}
        style={styles.deleteButton}
      />
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  detailCard: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  tableNumber: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.surface,
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
  sectionValue: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
  },
  statusButtons: {
    gap: SPACING.sm,
  },
  statusButton: {
    marginTop: 0,
  },
  deleteButton: {
    marginTop: SPACING.lg,
  },
});

export default TableDetail;
