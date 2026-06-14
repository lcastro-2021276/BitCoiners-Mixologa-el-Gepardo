// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\components\auth\RoleGuard.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore.js';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/roles.js';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme.js';

const RoleGuard = ({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null 
}) => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  }

  if (!hasAccess) {
    return fallback || (
      <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
        <Text style={{ fontSize: FONT_SIZE.md, color: COLORS.textLight }}>
          No tienes permisos para ver esta sección
        </Text>
      </View>
    );
  }

  return children;
};

export default RoleGuard;
