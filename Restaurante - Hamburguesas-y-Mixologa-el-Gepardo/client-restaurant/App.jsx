// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\App.jsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/shared/constants/theme.js';
import AppNavigator from './src/navigation/AppNavigator.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
