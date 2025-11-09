import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, disabled, loading, variant = 'primary', className = '', textClassName = '' }) => {
  const base =
    'rounded-lg py-3 px-4 items-center justify-center active:opacity-90';
  const variants = {
    primary: 'bg-brand-600 dark:bg-brand-500',
    secondary: 'bg-neutral-200 dark:bg-neutral-800',
    danger: 'bg-red-600',
  };
  const textBase = 'font-semibold';
  const textVariant = variant === 'secondary' ? 'text-neutral-900 dark:text-neutral-100' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${disabled ? 'opacity-60' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#111' : '#fff'} />
      ) : (
        <Text className={`${textBase} ${textVariant} ${textClassName}`}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Button;
