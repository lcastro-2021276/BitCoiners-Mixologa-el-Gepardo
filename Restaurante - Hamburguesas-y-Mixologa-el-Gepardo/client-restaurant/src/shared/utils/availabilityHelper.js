// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\utils\availabilityHelper.js
import { COLORS } from '../constants/theme.js';

export const isAvailable = (item) => {
  if (!item) return false;
  
  // Check for isDeleted flag
  if (item.isDeleted === true) return false;
  
  // Check for available flag (used for menu items)
  if (item.available === false) return false;
  
  return true;
};

export const getAvailabilityLabel = (item) => {
  if (isAvailable(item)) {
    return 'Disponible';
  }
  return 'No disponible';
};

export const getAvailabilityColors = (item) => {
  if (isAvailable(item)) {
    return {
      background: COLORS.surface,
      border: COLORS.border,
      text: COLORS.text,
      badge: COLORS.success,
    };
  }
  
  return {
    background: COLORS.unavailableBackground,
    border: COLORS.unavailableBorder,
    text: COLORS.unavailableText,
    badge: COLORS.unavailableBadge,
  };
};

export const getAvailabilityMessage = (item, type = 'general') => {
  if (isAvailable(item)) {
    return '';
  }
  
  const messages = {
    restaurant: 'Este restaurante se encuentra temporalmente fuera de servicio.',
    menu: 'Este producto no está disponible temporalmente.',
    table: 'Esta mesa se encuentra fuera de servicio.',
    general: 'Actualmente no disponible',
  };
  
  return messages[type] || messages.general;
};

export const getAvailabilityOpacity = (item) => {
  if (isAvailable(item)) {
    return 1;
  }
  return 0.5;
};

export const getAvailabilityGrayscale = (item) => {
  return !isAvailable(item);
};
