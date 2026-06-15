// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\tables\screens\ReservationHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { useReservations } from '../hooks/useReservations.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const ReservationHistory = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchReservations, cancelReservation, loading, error } = useReservations();

  const loadReservations = useCallback(async () => {
    const result = await fetchReservations();
    if (result.success) {
      setReservations(result.data);
    }
  }, [fetchReservations]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  }, [loadReservations]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return COLORS.success;
      case 'pendiente':
        return COLORS.warning;
      case 'cancelada':
        return COLORS.error;
      case 'completada':
        return COLORS.primary;
      default:
        return COLORS.secondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      case 'completada':
        return 'Completada';
      default:
        return status;
    }
  };

  const handleCancelReservation = async (reservationId) => {
    Alert.alert(
      'Cancelar Reservación',
      '¿Estás seguro de cancelar esta reservación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelReservation(reservationId);
            if (result.success) {
              Alert.alert('Éxito', 'Reservación cancelada correctamente');
              loadReservations();
            } else {
              Alert.alert('Error', result.error || 'Error al cancelar reservación');
            }
          },
        },
      ]
    );
  };

  const isCancellable = (status, date) => {
    if (status === 'cancelada' || status === 'completada') return false;
    const reservationDate = new Date(date);
    const now = new Date();
    const hoursDiff = (reservationDate - now) / (1000 * 60 * 60);
    return hoursDiff > 2; // Can cancel if more than 2 hours before
  };

  if (loading && reservations.length === 0) {
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
          <Text style={styles.title}>Historial de Reservas</Text>
          <TouchableOpacity 
            style={styles.newReservationButton}
            onPress={() => navigation.navigate('CreateReservation')}
          >
            <MaterialIcons name="add" size={24} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        {reservations.length === 0 ? (
          <EmptyState 
            message="No tienes reservaciones" 
            icon={<MaterialIcons name="event-busy" size={48} color={COLORS.secondary} />}
          />
        ) : (
          <View style={styles.reservationsContainer}>
            {reservations.map((reservation) => {
              const canCancel = isCancellable(reservation.status, reservation.date);
              
              return (
                <Card key={reservation._id || reservation.id} style={styles.reservationCard}>
                  <View style={styles.reservationHeader}>
                    <View style={styles.tableInfo}>
                      <MaterialIcons name="table-restaurant" size={24} color={COLORS.primary} />
                      <Text style={styles.tableNumber}>Mesa {reservation.table?.number || reservation.table}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                      <Text style={styles.statusText}>{getStatusLabel(reservation.status)}</Text>
                    </View>
                  </View>

                  <View style={styles.reservationBody}>
                    <View style={styles.infoRow}>
                      <MaterialIcons name="event" size={20} color={COLORS.secondary} />
                      <Text style={styles.infoLabel}>Fecha:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(reservation.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialIcons name="schedule" size={20} color={COLORS.secondary} />
                      <Text style={styles.infoLabel}>Hora:</Text>
                      <Text style={styles.infoValue}>{reservation.time}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialIcons name="people" size={20} color={COLORS.secondary} />
                      <Text style={styles.infoLabel}>Invitados:</Text>
                      <Text style={styles.infoValue}>{reservation.guests} personas</Text>
                    </View>

                    {reservation.specialRequests && (
                      <View style={styles.specialRequestsContainer}>
                        <MaterialIcons name="note" size={20} color={COLORS.secondary} />
                        <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
                      </View>
                    )}
                  </View>

                  {canCancel && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelReservation(reservation._id || reservation.id)}
                    >
                      <MaterialIcons name="cancel" size={20} color={COLORS.error} />
                      <Text style={styles.cancelButtonText}>Cancelar Reservación</Text>
                    </TouchableOpacity>
                  )}
                </Card>
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
  newReservationButton: {
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
  reservationsContainer: {
    gap: SPACING.md,
  },
  reservationCard: {
    padding: SPACING.lg,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tableNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  reservationBody: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    width: 60,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  specialRequestsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  specialRequestsText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: '#fee2e2',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default ReservationHistory;
