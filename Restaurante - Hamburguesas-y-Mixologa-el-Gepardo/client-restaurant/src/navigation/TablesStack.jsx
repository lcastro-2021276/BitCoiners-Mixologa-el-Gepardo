// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\TablesStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TablesList from '../features/tables/screens/TablesList.jsx';
import TableDetail from '../features/tables/screens/TableDetail.jsx';
import CreateReservation from '../features/tables/screens/CreateReservation.jsx';
import ReservationHistory from '../features/tables/screens/ReservationHistory.jsx';
import useAuthStore from '../shared/store/authStore.js';

const Stack = createNativeStackNavigator();

const TablesStack = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TablesList" component={TablesList} />
      <Stack.Screen name="TableDetail" component={TableDetail} />
      {isAdmin && <Stack.Screen name="CreateReservation" component={CreateReservation} />}
      {isAdmin && <Stack.Screen name="ReservationHistory" component={ReservationHistory} />}
    </Stack.Navigator>
  );
};

export default TablesStack;
