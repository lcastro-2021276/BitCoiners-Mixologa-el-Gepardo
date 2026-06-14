// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\MenuStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuList from '../features/menu/screens/MenuList.jsx';
import MenuDetail from '../features/menu/screens/MenuDetail.jsx';
import CreateMenuItem from '../features/menu/screens/CreateMenuItem.jsx';

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MenuList" component={MenuList} />
      <Stack.Screen name="MenuDetail" component={MenuDetail} />
      <Stack.Screen name="CreateMenuItem" component={CreateMenuItem} />
    </Stack.Navigator>
  );
};

export default MenuStack;
