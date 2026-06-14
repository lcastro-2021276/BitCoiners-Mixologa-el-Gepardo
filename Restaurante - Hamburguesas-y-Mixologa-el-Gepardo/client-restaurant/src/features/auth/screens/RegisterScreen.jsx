// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\auth\screens\RegisterScreen.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

const RegisterScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { handleRegister, loading, error } = useAuth();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    const result = await handleRegister(data);
    if (result.success) {
      Alert.alert(
        'Registro Exitoso',
        'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../assets/mixologias.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Restaurante El Gepardo</Text>

          <Input
            label="Nombre"
            name="name"
            control={control}
            rules={{ required: 'El nombre es requerido' }}
            placeholder="Juan"
            error={errors.name?.message}
          />

          <Input
            label="Apellido"
            name="surname"
            control={control}
            rules={{ required: 'El apellido es requerido' }}
            placeholder="Pérez"
            error={errors.surname?.message}
          />

          <Input
            label="Usuario"
            name="username"
            control={control}
            rules={{ required: 'El usuario es requerido' }}
            placeholder="juanperez"
            error={errors.username?.message}
          />

          <Input
            label="Correo electrónico"
            name="email"
            control={control}
            rules={{ 
              required: 'El correo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo inválido'
              }
            }}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            name="password"
            control={control}
            rules={{ 
              required: 'La contraseña es requerida',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password?.message}
          />

          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            control={control}
            rules={{ 
              required: 'La confirmación de contraseña es requerida',
              validate: (value) => {
                if (value !== control._formValues.password) {
                  return 'Las contraseñas no coinciden';
                }
                return true;
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.confirmPassword?.message}
          />

          <Input
            label="Teléfono"
            name="phone"
            control={control}
            rules={{ 
              required: 'El teléfono es requerido',
              pattern: {
                value: /^[0-9+\s()-]+$/,
                message: 'El teléfono debe contener solo números'
              }
            }}
            placeholder="+52 123 456 7890"
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión aquí</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  loginTextBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
