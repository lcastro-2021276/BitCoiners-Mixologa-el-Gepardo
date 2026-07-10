// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\profile\screens\Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useProfile } from '../hooks/useProfile.js';
import useAuthStore from '../../../shared/store/authStore.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const Profile = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const { fetchProfile, updateProfile, handleLogout, loading, error } = useProfile();
  const { user } = useAuthStore();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: '',
      phone: '',
      email: '',
    },
  });

  const loadProfile = useCallback(async () => {
    const result = await fetchProfile();
    if (result.success) {
      setProfile(result.data);
      reset({
        displayName: result.data.displayName || '',
        phone: result.data.phone || '',
        email: result.data.email || '',
      });
    }
  }, [fetchProfile, reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      loadProfile();
    } else {
      Alert.alert('Error', result.error || 'Error al actualizar perfil');
    }
  };

  const onLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await handleLogout();
          },
        },
      ]
    );
  };

  if (!profile && loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={60} color={COLORS.primary} />
        </View>
        <Text style={styles.username}>{user?.username || 'Usuario'}</Text>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <Input
          label="Nombre de Usuario"
          name="displayName"
          control={control}
          rules={{ required: 'El nombre es requerido' }}
          placeholder="Tu nombre"
        />

        <Input
          label="Teléfono"
          name="phone"
          control={control}
          placeholder="Tu teléfono"
          keyboardType="phone-pad"
        />

        <Input
          label="Correo Electrónico"
          name="email"
          control={control}
          rules={{ 
            required: 'El correo es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo inválido'
            }
          }}
          placeholder="tu@correo.com"
          keyboardType="email-address"
          editable={false}
        />

        <Button
          title="Guardar Cambios"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.saveButton}
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Información de Cuenta</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Usuario:</Text>
          <Text style={styles.infoValue}>{user?.username || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || '-'}</Text>
        </View>
      </Card>

      <Button
        title="Cerrar Sesión"
        onPress={onLogout}
        variant="secondary"
        style={styles.logoutButton}
      />
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
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '20',
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
  },
  username: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  errorCard: {
    marginBottom: SPACING.lg,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  formCard: {
    marginBottom: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '20',
  },
  saveButton: {
    marginTop: SPACING.xl,
    borderRadius: 16,
  },
  infoCard: {
    marginBottom: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  logoutButton: {
    marginTop: SPACING.xl,
    borderRadius: 16,
  },
});

export default Profile;
