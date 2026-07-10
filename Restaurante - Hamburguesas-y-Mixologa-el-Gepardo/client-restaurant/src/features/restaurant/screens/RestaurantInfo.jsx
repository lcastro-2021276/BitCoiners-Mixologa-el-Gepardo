// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\restaurant\screens\RestaurantInfo.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, Rating } from '../../../shared/components/common/Common.jsx';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';
import { useRatings } from '../../ratings/hooks/useRatings.js';
import Button from '../../../shared/components/common/Button.jsx';

const RestaurantInfo = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { submitRating, getUserRating, loading: ratingLoading } = useRatings();
  const [restaurant, setRestaurant] = useState({
    name: 'El Gepardo',
    category: 'Hamburguesas & Mixología',
    description: 'El mejor lugar para disfrutar de hamburguesas artesanales y cócteles exclusivos en un ambiente moderno y acogedor.',
    address: 'Av. Principal #123, Zona 10',
    city: 'Guatemala, Guatemala',
    phone: '+502 2234 5678',
    email: 'contacto@elgepardo.com',
    hours: {
      monday: '12:00 PM - 11:00 PM',
      tuesday: '12:00 PM - 11:00 PM',
      wednesday: '12:00 PM - 11:00 PM',
      thursday: '12:00 PM - 11:00 PM',
      friday: '12:00 PM - 12:00 AM',
      saturday: '12:00 PM - 12:00 AM',
      sunday: '12:00 PM - 10:00 PM',
    },
    priceRange: '$$ - $$$',
    rating: 4.5,
    totalReviews: 328,
    features: [
      'Terraza',
      'Estacionamiento',
      'WiFi',
      'Accesible',
      'Aire Acondicionado',
      'Música en Vivo',
      'Bar Completo',
      'Área de Fumadores',
    ],
    socialMedia: {
      facebook: 'https://facebook.com/elgepardo',
      instagram: 'https://instagram.com/elgepardo',
      twitter: 'https://twitter.com/elgepardo',
      tiktok: 'https://tiktok.com/@elgepardo',
    },
  });

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phone}`).catch(() => {
      Alert.alert('Error', 'No se pudo realizar la llamada');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${restaurant.email}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el correo');
    });
  };

  const handleMap = () => {
    const address = encodeURIComponent(`${restaurant.address}, ${restaurant.city}`);
    Linking.openURL(`https://maps.google.com/?q=${address}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el mapa');
    });
  };

  const handleSocialMedia = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    });
  };

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    const result = await submitRating({
      targetType: 'restaurant',
      targetId: 'elgepardo',
      rating: userRating,
    });

    if (result.success) {
      Alert.alert('Éxito', 'Gracias por tu calificación');
      setShowRatingModal(false);
      setUserRating(0);
    } else {
      Alert.alert('Error', result.error || 'Error al enviar calificación');
    }
  };

  const loadUserRating = useCallback(async () => {
    const result = await getUserRating('restaurant', 'elgepardo');
    if (result.success) {
      setUserRating(result.data.rating || 0);
    }
  }, [getUserRating]);

  useEffect(() => {
    loadUserRating();
  }, [loadUserRating]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<MaterialIcons key={`restaurant-star-${i}`} name="star" size={20} color={COLORS.warning} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<MaterialIcons key={`restaurant-star-half-${i}`} name="star-half" size={20} color={COLORS.warning} />);
      } else {
        stars.push(<MaterialIcons key={`restaurant-star-outline-${i}`} name="star-outline" size={20} color={COLORS.warning} />);
      }
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/mixologias.png')}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
          </View>
        </View>

        {/* Rating and Reviews */}
        <Card style={styles.ratingCard}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(restaurant.rating)}
            </View>
            <Text style={styles.ratingValue}>{restaurant.rating}</Text>
            <Text style={styles.reviewsCount}>({restaurant.totalReviews} reseñas)</Text>
          </View>
          <View style={styles.ratingButtons}>
            <TouchableOpacity 
              style={styles.rateButton}
              onPress={() => setShowRatingModal(true)}
            >
              <MaterialIcons name="star" size={20} color={COLORS.surface} />
              <Text style={styles.rateButtonText}>Calificar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.reviewsButton}
              onPress={() => navigation.navigate('Reviews', { 
                targetType: 'restaurant', 
                targetId: 'elgepardo',
                targetName: restaurant.name 
              })}
            >
              <MaterialIcons name="rate-review" size={20} color={COLORS.surface} />
              <Text style={styles.rateButtonText}>Ver Reseñas</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Description */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sobre Nosotros</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
        </Card>

        {/* Contact Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={handleMap}>
            <MaterialIcons name="location-on" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Dirección</Text>
              <Text style={styles.contactValue}>{restaurant.address}</Text>
              <Text style={styles.contactSubValue}>{restaurant.city}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
            <MaterialIcons name="phone" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{restaurant.phone}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
            <MaterialIcons name="email" size={24} color={COLORS.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Correo</Text>
              <Text style={styles.contactValue}>{restaurant.email}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        </Card>

        {/* Hours */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Horario de Atención</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Lunes - Jueves</Text>
              <Text style={styles.hoursValue}>{restaurant.hours.monday}</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Viernes - Sábado</Text>
              <Text style={styles.hoursValue}>{restaurant.hours.friday}</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Domingo</Text>
              <Text style={styles.hoursValue}>{restaurant.hours.sunday}</Text>
            </View>
          </View>
        </Card>

        {/* Price Range */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Rango de Precios</Text>
          <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
          <Text style={styles.priceDescription}>Precios moderados a altos</Text>
        </Card>

        {/* Features */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresContainer}>
            {restaurant.features.map((feature, index) => (
              <View key={`feature-${index}-${feature}`} style={styles.featureBadge}>
                <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Social Media */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Síguenos</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia(restaurant.socialMedia.facebook)}
            >
              <MaterialIcons name="facebook" size={32} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia(restaurant.socialMedia.instagram)}
            >
              <MaterialIcons name="camera-alt" size={32} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia(restaurant.socialMedia.twitter)}
            >
              <MaterialIcons name="alternate-email" size={32} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia(restaurant.socialMedia.tiktok)}
            >
              <MaterialIcons name="music-note" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calificar Restaurante</Text>
              <TouchableOpacity onPress={() => setShowRatingModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>¿Qué te pareció tu experiencia en El Gepardo?</Text>
              <View style={styles.ratingInputContainer}>
                <Rating
                  rating={userRating}
                  onRatingChange={setUserRating}
                  size={40}
                />
              </View>
              <Text style={styles.ratingText}>
                {userRating > 0 ? `${userRating} de 5 estrellas` : 'Selecciona una calificación'}
              </Text>
              <Button
                title="Enviar Calificación"
                onPress={handleRatingSubmit}
                loading={ratingLoading}
                style={styles.modalButton}
              />
              <Button
                title="Cancelar"
                onPress={() => setShowRatingModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.xl,
  },
  restaurantName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  restaurantCategory: {
    fontSize: FONT_SIZE.lg,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  ratingCard: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '15',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  reviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
  },
  rateButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.surface,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  reviewsCount: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  infoCard: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: 20,
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
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '20',
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 26,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  contactInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  contactLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  contactSubValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  hoursContainer: {
    gap: SPACING.md,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  dayLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  hoursValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  priceRange: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  priceDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  featureText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '20',
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  ratingInputContainer: {
    marginBottom: SPACING.md,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  modalButton: {
    marginTop: SPACING.md,
    width: '100%',
  },
});

export default RestaurantInfo;
