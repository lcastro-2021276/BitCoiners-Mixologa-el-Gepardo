// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\components\common\Rating.jsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme.js';

const Rating = ({ rating, onRatingChange, readonly = false, size = 24 }) => {
  const renderStar = (starNumber) => {
    const filled = starNumber <= rating;
    const halfFilled = starNumber - 0.5 === rating;

    if (halfFilled) {
      return (
        <MaterialIcons
          key={`star-half-${starNumber}`}
          name="star-half"
          size={size}
          color={COLORS.warning}
        />
      );
    }

    return (
      <MaterialIcons
        key={`star-${starNumber}`}
        name={filled ? 'star' : 'star-outline'}
        size={size}
        color={filled ? COLORS.warning : COLORS.border}
      />
    );
  };

  if (readonly) {
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <View key={`readonly-star-${starNumber}`}>
            {renderStar(starNumber)}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <TouchableOpacity
          key={`touchable-star-${starNumber}`}
          onPress={() => onRatingChange && onRatingChange(starNumber)}
          activeOpacity={0.7}
        >
          {renderStar(starNumber)}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
});

export default Rating;
