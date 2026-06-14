// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\auth\screens\LoginScreen.jsx
import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { handleLogin, loading, error } = useAuth();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const decorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(decorAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onSubmit = async (data) => {
    const result = await handleLogin(data);
    if (result.success) {
      // El cambio de pantalla se maneja automáticamente desde AppNavigator
      // cuando el store de autenticación pasa a isAuthenticated = true.
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Background Image with Parallax Effect */}
        <Animated.Image
          source={require('../../../../assets/mixologias.png')}
          style={[
            styles.backgroundImage,
            {
              transform: [{ scale: Animated.add(1, Animated.multiply(decorAnim, 0.1)) }]
            }
          ]}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View style={styles.overlay} />
        
        {/* Animated Particles */}
        <Animated.View 
          style={[
            styles.particle1,
            { 
              opacity: decorAnim,
              transform: [
                { translateY: Animated.multiply(decorAnim, -30) },
                { scale: decorAnim }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.particle2,
            { 
              opacity: decorAnim,
              transform: [
                { translateY: Animated.multiply(decorAnim, 40) },
                { scale: decorAnim }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.particle3,
            { 
              opacity: decorAnim,
              transform: [
                { translateY: Animated.multiply(decorAnim, -20) },
                { scale: decorAnim }
              ] 
            }
          ]} 
        />

        {/* Logo Section with Image */}
        <Animated.View style={[styles.logoContainer, { opacity: logoAnim, transform: [{ translateY: Animated.multiply(logoAnim, -30) }] }]}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../../../assets/mixologias.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.crown}>
              <MaterialIcons name="emoji-events" size={35} color="#FFD700" />
            </View>
          </View>
          <Text style={styles.brandName}>EL GEPARDO</Text>
          <Text style={styles.brandSubtitle}>Hamburguesas & Mixología</Text>
        </Animated.View>

        {/* Form Container with Glass Effect */}
        <Animated.View style={[styles.formContainer, { opacity: formAnim, transform: [{ translateY: Animated.multiply(formAnim, 30) }] }]}>
          <View style={styles.formHeader}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

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
            style={styles.input}
          />

          <Input
            label="Contraseña"
            name="password"
            control={control}
            rules={{ 
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password?.message}
            style={styles.input}
          />

          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Button
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              loading={loading}
              style={styles.button}
            />
          </Animated.View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.registerTextBold}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    minHeight: height,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  particle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    top: height * 0.15,
    right: -30,
  },
  particle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: height * 0.4,
    left: -20,
  },
  particle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    bottom: height * 0.25,
    right: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.12,
    marginBottom: SPACING.xl,
    zIndex: 1,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  crown: {
    position: 'absolute',
    top: -15,
    right: -10,
  },
  brandName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.surface,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  brandSubtitle: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 2,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 24,
    padding: SPACING.xxl,
    marginHorizontal: SPACING.xl,
    ...SHADOWS.xl,
    zIndex: 1,
  },
  formHeader: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  input: {
    marginBottom: SPACING.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: SPACING.sm,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  button: {
    marginTop: SPACING.lg,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  registerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  registerTextBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
