// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\features\reviews\screens\Reviews.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner, EmptyState, Rating } from '../../../shared/components/common/Common.jsx';
import { useReviews } from '../hooks/useReviews.js';
import AppHeader from '../../../shared/components/layout/AppHeader.jsx';

const Reviews = ({ route, navigation }) => {
  const { targetType, targetId, targetName } = route.params || {};
  const [reviews, setReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { fetchReviews, submitReview, deleteReview, loading, error } = useReviews();

  const loadReviews = useCallback(async () => {
    const result = await fetchReviews(targetType, targetId);
    if (result.success) {
      setReviews(result.data);
    }
  }, [fetchReviews, targetType, targetId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  }, [loadReviews]);

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Por favor escribe un comentario');
      return;
    }

    const result = await submitReview({
      targetType,
      targetId,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    if (result.success) {
      Alert.alert('Éxito', 'Tu reseña ha sido publicada');
      setNewReview({ rating: 0, comment: '' });
      setShowAddReview(false);
      loadReviews();
    } else {
      Alert.alert('Error', result.error || 'Error al publicar reseña');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      'Eliminar Reseña',
      '¿Estás seguro de eliminar tu reseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteReview(reviewId);
            if (result.success) {
              Alert.alert('Éxito', 'Reseña eliminada correctamente');
              loadReviews();
            } else {
              Alert.alert('Error', result.error || 'Error al eliminar reseña');
            }
          },
        },
      ]
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<MaterialIcons key={`review-star-${i}`} name="star" size={16} color={COLORS.warning} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<MaterialIcons key={`review-star-half-${i}`} name="star-half" size={16} color={COLORS.warning} />);
      } else {
        stars.push(<MaterialIcons key={`review-star-outline-${i}`} name="star-outline" size={16} color={COLORS.warning} />);
      }
    }
    return stars;
  };

  if (loading && reviews.length === 0) {
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
          <Text style={styles.title}>Reseñas</Text>
          <Text style={styles.subtitle}>{targetName || 'Restaurante'}</Text>
        </View>

        {/* Rating Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContainer}>
            <View style={styles.averageRatingContainer}>
              <Text style={styles.averageRating}>{getAverageRating()}</Text>
              <View style={styles.starsContainer}>{renderStars(getAverageRating())}</View>
              <Text style={styles.totalReviews}>{reviews.length} reseñas</Text>
            </View>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setShowAddReview(true)}
            >
              <MaterialIcons name="add" size={20} color={COLORS.surface} />
              <Text style={styles.addReviewButtonText}>Escribir Reseña</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        {reviews.length === 0 ? (
          <EmptyState 
            message="No hay reseñas aún" 
            icon={<MaterialIcons name="rate-review" size={48} color={COLORS.secondary} />}
          />
        ) : (
          <View style={styles.reviewsContainer}>
            {reviews.map((review) => (
              <TouchableOpacity
                key={review._id || review.id}
                style={styles.reviewCard}
                activeOpacity={0.7}
              >
                <View style={styles.reviewImageContainer}>
                  <View style={styles.reviewImageGradient}>
                    <MaterialIcons name="person" size={48} color={COLORS.primary} />
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: COLORS.warning }]}>
                    <Text style={styles.ratingBadgeText}>{review.rating}</Text>
                  </View>
                </View>
                <View style={styles.reviewContent}>
                  <Text style={styles.userName}>{review.user?.name || 'Usuario'}</Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.reviewComment} numberOfLines={3}>{review.comment}</Text>
                </View>
                {review.isOwn && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReview(review._id || review.id)}
                  >
                    <MaterialIcons name="delete" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Add Review Modal */}
        {showAddReview && (
          <View style={styles.addReviewModal}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Escribir Reseña</Text>
                <TouchableOpacity onPress={() => setShowAddReview(false)}>
                  <MaterialIcons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalSubtitle}>¿Qué te pareció tu experiencia?</Text>
                <View style={styles.ratingInput}>
                  <Rating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    size={32}
                  />
                </View>
                <Text style={styles.ratingLabel}>
                  {newReview.rating > 0 ? `${newReview.rating} de 5 estrellas` : 'Selecciona una calificación'}
                </Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escribe tu reseña aquí..."
                  multiline
                  numberOfLines={4}
                  value={newReview.comment}
                  onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitReview}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Publicando...' : 'Publicar Reseña'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  summaryCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  averageRatingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: SPACING.xs,
  },
  totalReviews: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  addReviewButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.surface,
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
  reviewsContainer: {
    gap: SPACING.md,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  reviewImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  reviewImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
  },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.surface,
  },
  reviewContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  userName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  reviewDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  reviewComment: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingRight: SPACING.md,
    paddingLeft: SPACING.sm,
  },
  addReviewModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  ratingInput: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ratingLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  commentInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default Reviews;
