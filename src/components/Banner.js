// components/Banner.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Banner({
  type = 'info',
  text,
  ctaTitle,
  onPress,
  dismissible = false,
  onDismiss,
}) {
  const bg =
    type === 'warning'
      ? 'bg-amber-100 dark:bg-amber-900/30'
      : 'bg-neutral-100 dark:bg-neutral-800';
  const fg =
    type === 'warning'
      ? 'text-amber-900 dark:text-amber-100'
      : 'text-neutral-800 dark:text-neutral-100';

  return (
    <View
      className={`rounded-md px-3 py-3 mb-4 ${bg} flex-row items-center justify-between`}
    >
      <Text className={`flex-1 ${fg}`}>{text}</Text>
      {ctaTitle && onPress ? (
        <TouchableOpacity
          onPress={onPress}
          className="ml-3 px-3 py-2 rounded bg-neutral-900 dark:bg-neutral-100"
        >
          <Text className="text-white dark:text-neutral-900 font-semibold">
            {ctaTitle}
          </Text>
        </TouchableOpacity>
      ) : null}
      {dismissible ? (
        <TouchableOpacity onPress={onDismiss} className="ml-2">
          <Text className={`${fg}`}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
