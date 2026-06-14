// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\TablesStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TablesList from '../features/tables/screens/TablesList.jsx';
import TableDetail from '../features/tables/screens/TableDetail.jsx';

const Stack = createNativeStackNavigator();

const TablesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TablesList" component={TablesList} />
      <Stack.Screen name="TableDetail" component={TableDetail} />
    </Stack.Navigator>
  );
};

export default TablesStack;
