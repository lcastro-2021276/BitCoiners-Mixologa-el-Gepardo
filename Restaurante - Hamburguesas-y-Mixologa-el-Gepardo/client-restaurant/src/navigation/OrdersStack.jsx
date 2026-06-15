// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\OrdersStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersList from '../features/orders/screens/OrdersList.jsx';
import CreateOrder from '../features/orders/screens/CreateOrder.jsx';
import OrderDetail from '../features/orders/screens/OrderDetail.jsx';

const Stack = createNativeStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OrdersList" component={OrdersList} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
    </Stack.Navigator>
  );
};

export default OrdersStack;
