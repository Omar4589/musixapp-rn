// lib/toast.js
import Toast from 'react-native-toast-message';

export const toast = {
  success: (text1, props = {}) =>
    Toast.show({ type: 'success', text1, ...props }),
  error: (text1, props = {}) => Toast.show({ type: 'error', text1, ...props }),
  info: (text1, props = {}) => Toast.show({ type: 'info', text1, ...props }),
};
