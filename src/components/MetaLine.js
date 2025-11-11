// components/MetaLine.js
import React from 'react';
import { Text } from 'react-native';

export default function MetaLine({ parts = [], className }) {
  const items = parts.filter(Boolean);
  if (!items.length) return null;
  return (
    <Text className={className || 'text-neutral-500 dark:text-neutral-400'}>
      {items.join(' • ')}
    </Text>
  );
}
