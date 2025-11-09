import React from 'react';
import { Text } from 'react-native';

const ErrorNotice = ({ message }) =>
  message ? (
    <Text className="text-red-600 dark:text-red-400 mb-3">{message}</Text>
  ) : null;

export default ErrorNotice;
