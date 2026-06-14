// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\store\authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) { await SecureStore.setItemAsync('refreshToken', refreshToken); }
          set({
            token: accessToken,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error saving refresh token:', error);
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('refreshToken');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Error deleting refresh token:', error);
        }
      },

      setAccessToken: (accessToken) => {
        set({ token: accessToken });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          try {
            const value = await SecureStore.getItemAsync(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error getting item from SecureStore:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await SecureStore.setItemAsync(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error setting item in SecureStore:', error);
          }
        },
        removeItem: async (name) => {
          try {
            await SecureStore.deleteItemAsync(name);
          } catch (error) {
            console.error('Error removing item from SecureStore:', error);
          }
        },
      })),
      onRehydrateStorage: () => (state, action) => {
        // Marcar que la hidratación está completa
        if (state) {
          state._hasHydrated = true;
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;