// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\navigation\MenuStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuList from '../features/menu/screens/MenuList.jsx';
import MenuDetail from '../features/menu/screens/MenuDetail.jsx';
import CreateMenuItem from '../features/menu/screens/CreateMenuItem.jsx';
import useAuthStore from '../shared/store/authStore.js';

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MenuList" component={MenuList} />
      <Stack.Screen name="MenuDetail" component={MenuDetail} />
      {isAdmin && <Stack.Screen name="CreateMenuItem" component={CreateMenuItem} />}
    </Stack.Navigator>
  );
};

export default MenuStack;
