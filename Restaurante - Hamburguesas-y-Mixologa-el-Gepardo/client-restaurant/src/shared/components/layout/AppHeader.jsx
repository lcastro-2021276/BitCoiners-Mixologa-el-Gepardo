// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\components\layout\AppHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme.js';

const AppHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/mixologias.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>El Gepardo</Text>
        <Text style={styles.tagline}>Hamburguesas y Mixología</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.surface,
  },
  tagline: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.surface,
    opacity: 0.9,
  },
});

export default AppHeader;
