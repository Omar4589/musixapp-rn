import React from 'react';
import { View, Text, TextInput } from 'react-native';

const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
}) => (
  <View className="mb-3">
    {!!label && (
      <Text className="mb-1.5 text-neutral-800 dark:text-neutral-100">
        {label}
      </Text>
    )}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      className="border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-3 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
    />
  </View>
);

export default TextField;
