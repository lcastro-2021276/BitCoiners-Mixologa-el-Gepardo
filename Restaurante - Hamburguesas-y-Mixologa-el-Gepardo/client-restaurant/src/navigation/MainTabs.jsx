// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../shared/constants/theme.js';
import Home from '../features/home/screens/Home.jsx';
import OrdersStack from './OrdersStack.jsx';
import MenuStack from './MenuStack.jsx';
import TablesStack from './TablesStack.jsx';
import RestaurantStack from './RestaurantStack.jsx';
import Profile from '../features/profile/screens/Profile.jsx';
import useAuthStore from '../shared/store/authStore.js';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Pedidos') {
            iconName = 'receipt-long';
          } else if (route.name === 'Menú') {
            iconName = 'restaurant-menu';
          } else if (route.name === 'Mesas') {
            iconName = 'table-restaurant';
          } else if (route.name === 'Restaurante') {
            iconName = 'store';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        headerShown: route.name === 'Perfil',
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Pedidos" component={OrdersStack} />
      <Tab.Screen name="Menú" component={MenuStack} />
      <Tab.Screen name="Mesas" component={TablesStack} />
      <Tab.Screen name="Restaurante" component={RestaurantStack} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
};

export default MainTabs;
