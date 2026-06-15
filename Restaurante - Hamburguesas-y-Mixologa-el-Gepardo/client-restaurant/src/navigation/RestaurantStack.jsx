// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\RestaurantStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../shared/constants/theme.js';
import RestaurantInfo from '../features/restaurant/screens/RestaurantInfo.jsx';
import Promotions from '../features/restaurant/screens/Promotions.jsx';
import Reviews from '../features/reviews/screens/Reviews.jsx';

const Stack = createNativeStackNavigator();

const RestaurantStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen 
        name="RestaurantInfo" 
        component={RestaurantInfo}
        options={{ title: 'Restaurante' }}
      />
      <Stack.Screen 
        name="Promotions" 
        component={Promotions}
        options={{ title: 'Promociones' }}
      />
      <Stack.Screen 
        name="Reviews" 
        component={Reviews}
        options={{ title: 'Reseñas' }}
      />
    </Stack.Navigator>
  );
};

export default RestaurantStack;
