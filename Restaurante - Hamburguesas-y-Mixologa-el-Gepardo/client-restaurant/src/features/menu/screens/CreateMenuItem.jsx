// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\menu\screens\CreateMenuItem.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { useMenu } from '../hooks/useMenu.js';
import useAuthStore from '../../../shared/store/authStore.js';

const CreateMenuItem = ({ route, navigation }) => {
  const { itemId } = route.params || {};
  const { createMenuItem, loading, error } = useMenu();
  const { user } = useAuthStore();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
    },
  });

  const onSubmit = async (data) => {
    const restaurantId = user?.restaurant?._id || user?.restaurantId || user?.restaurant;
    
    if (!restaurantId) {
      Alert.alert('Error', 'No se encontró el ID del restaurante. Por favor, inicia sesión nuevamente.');
      return;
    }

    const menuData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      restaurant: restaurantId,
      available: true,
    };

    const result = await createMenuItem(menuData);
    if (result.success) {
      Alert.alert('Éxito', 'Item de menú creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al crear item de menú');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>{itemId ? 'Editar Item' : 'Crear Item de Menú'}</Text>
      </View>

      {error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <Card style={styles.formCard}>
        <Input
          label="Nombre del Producto"
          name="name"
          control={control}
          rules={{ required: 'El nombre es requerido' }}
          placeholder="Ej: Hamburguesa Clásica"
        />

        <Input
          label="Descripción"
          name="description"
          control={control}
          rules={{ required: 'La descripción es requerida' }}
          placeholder="Descripción del producto"
          multiline
        />

        <Input
          label="Precio"
          name="price"
          control={control}
          rules={{ 
            required: 'El precio es requerido',
            validate: (value) => {
              const price = parseFloat(value);
              if (isNaN(price) || price <= 0) {
                return 'El precio debe ser mayor que 0';
              }
              return true;
            }
          }}
          placeholder="Ej: 85.00"
          keyboardType="decimal-pad"
        />
      </Card>

      <Button
        title={itemId ? 'Actualizar Item' : 'Crear Item'}
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
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
});

export default CreateMenuItem;
