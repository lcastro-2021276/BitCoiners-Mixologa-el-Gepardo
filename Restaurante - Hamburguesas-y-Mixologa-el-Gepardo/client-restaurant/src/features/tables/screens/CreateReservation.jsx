// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\screens\CreateReservation.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useReservations } from '../hooks/useReservations.js';
import { useTables } from '../hooks/useTables.js';

const CreateReservation = ({ route, navigation }) => {
  const { tableId } = route.params || {};
  const { createReservation, loading, error } = useReservations();
  const { fetchTables } = useTables();
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tableId: tableId || '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: '',
    },
  });

  const guests = watch('guests');

  const loadAvailableTables = useCallback(async () => {
    const result = await fetchTables();
    if (result.success) {
      const available = result.data.filter(table => 
        table.status === 'disponible' && table.capacity >= (guests || 2)
      );
      setAvailableTables(available);
      if (tableId) {
        const table = available.find(t => t.id === tableId);
        setSelectedTable(table);
      }
    }
  }, [fetchTables, tableId, guests]);

  React.useEffect(() => {
    loadAvailableTables();
  }, [loadAvailableTables]);

  const onSubmit = async (data) => {
    if (!data.tableId) {
      Alert.alert('Error', 'Selecciona una mesa');
      return;
    }

    if (!data.date) {
      Alert.alert('Error', 'Selecciona una fecha');
      return;
    }

    if (!data.time) {
      Alert.alert('Error', 'Selecciona una hora');
      return;
    }

    if (data.guests < 1) {
      Alert.alert('Error', 'El número de invitados debe ser al menos 1');
      return;
    }

    const reservationData = {
      tableId: data.tableId,
      date: data.date,
      time: data.time,
      guests: parseInt(data.guests),
      specialRequests: data.specialRequests || '',
      status: 'confirmada',
    };

    const result = await createReservation(reservationData);
    if (result.success) {
      Alert.alert('Reservación Exitosa', 'Tu mesa ha sido reservada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al crear reservación');
    }
  };

  const selectTable = (table) => {
    setSelectedTable(table);
    setValue('tableId', table.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservar Mesa</Text>
        <Text style={styles.subtitle}>Reserva tu mesa para disfrutar de la mejor experiencia</Text>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Seleccionar Mesa</Text>
        <View style={styles.tablesGrid}>
          {availableTables.length === 0 ? (
            <Text style={styles.noTables}>No hay mesas disponibles para el número de invitados</Text>
          ) : (
            availableTables.map((table) => (
              <TouchableOpacity
                key={table.id}
                style={[
                  styles.tableCard,
                  selectedTable?.id === table.id && styles.tableCardSelected,
                ]}
                onPress={() => selectTable(table)}
              >
                <MaterialIcons 
                  name="table-restaurant" 
                  size={32} 
                  color={selectedTable?.id === table.id ? COLORS.primary : COLORS.secondary} 
                />
                <Text style={styles.tableNumber}>Mesa {table.number}</Text>
                <Text style={styles.tableCapacity}>Capacidad: {table.capacity} personas</Text>
                {selectedTable?.id === table.id && (
                  <MaterialIcons name="check-circle" size={24} color={COLORS.success} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Información de la Reservación</Text>
        
        <Input
          label="Fecha"
          name="date"
          control={control}
          rules={{ required: 'La fecha es requerida' }}
          placeholder="DD/MM/YYYY"
        />

        <Input
          label="Hora"
          name="time"
          control={control}
          rules={{ required: 'La hora es requerida' }}
          placeholder="HH:MM"
        />

        <Input
          label="Número de Invitados"
          name="guests"
          control={control}
          rules={{ 
            required: 'El número de invitados es requerido',
            min: { value: 1, message: 'Mínimo 1 invitado' },
            max: { value: 20, message: 'Máximo 20 invitados' }
          }}
          placeholder="2"
          keyboardType="number-pad"
        />

        <Input
          label="Solicitudes Especiales (Opcional)"
          name="specialRequests"
          control={control}
          placeholder="Ej: Cumpleaños, alergias, etc."
          multiline
          numberOfLines={3}
        />
      </Card>

      {selectedTable && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de la Reservación</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mesa:</Text>
            <Text style={styles.summaryValue}>Mesa {selectedTable.number}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Capacidad:</Text>
            <Text style={styles.summaryValue}>{selectedTable.capacity} personas</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ubicación:</Text>
            <Text style={styles.summaryValue}>{selectedTable.location || 'No especificada'}</Text>
          </View>
        </Card>
      )}

      <Button
        title="Confirmar Reservación"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.submitButton}
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
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
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
  formCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tableCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  tableCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  tableNumber: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  tableCapacity: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  checkIcon: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  noTables: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  summaryCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  submitButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});

export default CreateReservation;
