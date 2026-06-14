// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\utils\roles.js
export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

export const PERMISSIONS = {
  // Menu permissions
  VIEW_MENU: 'view_menu',
  CREATE_MENU_ITEM: 'create_menu_item',
  EDIT_MENU_ITEM: 'edit_menu_item',
  DELETE_MENU_ITEM: 'delete_menu_item',

  // Orders permissions
  VIEW_ORDERS: 'view_orders',
  CREATE_ORDER: 'create_order',
  EDIT_ORDER: 'edit_order',
  DELETE_ORDER: 'delete_order',

  // Tables permissions
  VIEW_TABLES: 'view_tables',
  CREATE_TABLE: 'create_table',
  EDIT_TABLE: 'edit_table',
  DELETE_TABLE: 'delete_table',
  CHANGE_TABLE_STATUS: 'change_table_status',

  // Profile permissions
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile',

  // Admin only permissions
  MANAGE_USERS: 'manage_users',
  VIEW_ALL_ORDERS: 'view_all_orders',
  VIEW_ANALYTICS: 'view_analytics',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_MENU,
    PERMISSIONS.CREATE_MENU_ITEM,
    PERMISSIONS.EDIT_MENU_ITEM,
    PERMISSIONS.DELETE_MENU_ITEM,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.EDIT_ORDER,
    PERMISSIONS.DELETE_ORDER,
    PERMISSIONS.VIEW_TABLES,
    PERMISSIONS.CREATE_TABLE,
    PERMISSIONS.EDIT_TABLE,
    PERMISSIONS.DELETE_TABLE,
    PERMISSIONS.CHANGE_TABLE_STATUS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.CLIENT]: [
    PERMISSIONS.VIEW_MENU,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_TABLES,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions?.includes(permission) || false;
};

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions) return false;
  return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions) return false;
  return permissions.every((permission) => hasPermission(userRole, permission));
};

export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

export const isClient = (userRole) => {
  return userRole === ROLES.CLIENT;
};
