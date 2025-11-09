// components/ProviderCard.js
import { View, Text, Pressable } from 'react-native';

export default function ProviderCard({ title, subtitle, linked, needsAttention, onLink, onUnlink, disabled=false }) {
  return (
    <View className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-3 bg-white dark:bg-neutral-900">
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</Text>
      {!!subtitle && (
        <Text className="text-xs mt-1 text-neutral-600 dark:text-neutral-400">{subtitle}</Text>
      )}

      {linked ? (
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-green-600 dark:text-green-400">Linked</Text>
          <Pressable
            className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700"
            onPress={onUnlink}
          >
            <Text className="text-neutral-900 dark:text-neutral-100">Unlink</Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-neutral-600 dark:text-neutral-400">
            {needsAttention ? 'Needs attention' : 'Not linked'}
          </Text>
          <Pressable
            className="px-3 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100"
            onPress={onLink}
            disabled={disabled}
          >
            <Text className="text-white dark:text-neutral-900">{disabled ? 'Unavailable' : 'Link'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
