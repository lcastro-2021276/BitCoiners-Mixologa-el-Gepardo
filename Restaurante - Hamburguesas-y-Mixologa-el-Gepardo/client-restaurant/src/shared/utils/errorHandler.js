// c:\repo\BitCoiners-Mixologa-el-Gepardo\Restaurante - Hamburguesas-y-Mixologa-el-Gepardo\client-restaurant\src\shared\utils\errorHandler.js
import { Alert } from 'react-native';
import useAuthStore from '../store/authStore.js';

export const getErrorMessage = (error) => {
  if (!error) return 'Ocurrió un error desconocido';

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Solicitud inválida. Verifica los datos ingresados.';
      case 401:
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'No se encontró la información solicitada.';
      case 409:
        return data?.message || 'El recurso ya existe o hay un conflicto.';
      case 422:
        return data?.message || 'Datos inválidos. Por favor, verifica la información.';
      case 429:
        return 'Has excedido el límite de solicitudes. Intenta más tarde.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde.';
      case 503:
        return 'El servicio no está disponible. Intenta más tarde.';
      default:
        return data?.message || `Error del servidor (${status})`;
    }
  }

  if (error.request) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  }

  if (error.message) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
};

export const showError = (error) => {
  const message = getErrorMessage(error);
  Alert.alert('Error', message, [{ text: 'OK' }]);
};

export const showErrorWithAction = (error, actionText, onAction) => {
  const message = getErrorMessage(error);
  Alert.alert('Error', message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: actionText, onPress: onAction },
  ]);
};

export const showSuccess = (message) => {
  Alert.alert('Éxito', message, [{ text: 'OK' }]);
};

export const showInfo = (message) => {
  Alert.alert('Información', message, [{ text: 'OK' }]);
};

export const showConfirm = (message, onConfirm, onCancel) => {
  Alert.alert(
    'Confirmación',
    message,
    [
      { text: 'Cancelar', style: 'cancel', onPress: onCancel },
      { text: 'Confirmar', onPress: onConfirm },
    ],
    { cancelable: true }
  );
};

export const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    const { logout } = useAuthStore.getState();
    logout();
  }
  return getErrorMessage(error);
};
