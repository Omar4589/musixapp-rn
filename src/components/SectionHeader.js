// components/SectionHeader.js
import React from 'react';
import { Text } from 'react-native';

export default function SectionHeader({ title, className }) {
  return (
    <Text className={className || 'text-lg font-semibold text-neutral-900 dark:text-neutral-100'}>
      {title}
    </Text>
  );
}
