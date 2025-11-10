// components/TextField.js
import React, { forwardRef } from 'react';
import { View, Text, TextInput } from 'react-native';

const TextField = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      keyboardType,
      autoCapitalize = 'none',
      // styling hooks (optional)
      containerClassName = '',
      inputClassName = '',
      // inline error (optional)
      errorText,
      // pass everything else to TextInput
      ...inputProps
    },
    ref,
  ) => {
    return (
      <View className={`mb-3 ${containerClassName}`}>
        {!!label && (
          <Text className="mb-1.5 text-neutral-800 dark:text-neutral-100">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          className={`border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-3 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 ${inputClassName}`}
          {...inputProps} // <-- returnKeyType, onSubmitEditing, blurOnSubmit, etc.
        />
        {!!errorText && (
          <Text className="text-xs mt-1 text-red-600 dark:text-red-400">
            {errorText}
          </Text>
        )}
      </View>
    );
  },
);

TextField.displayName = 'TextField';

export default TextField;
