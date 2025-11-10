// components/ProviderCard.js
import { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native';

export default function ProviderCard({
  title,
  subtitle,
  linked,
  needsAttention,
  onLink,
  onUnlink,
  // controls
  disabled = false,
  loadingLink = false,
  loadingUnlink = false,
}) {
  // tiny double-tap guard (same pattern as Button)
  const lastTapRef = useRef(0);
  const guard = fn => () => {
    const now = Date.now();
    if (now - lastTapRef.current < 600) return;
    lastTapRef.current = now;
    fn?.();
  };

  return (
    <View className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-3 bg-white dark:bg-neutral-900">
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </Text>

      {!!subtitle && (
        <Text className="text-xs mt-1 text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </Text>
      )}

      {linked ? (
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-green-600 dark:text-green-400">Linked</Text>

          <Pressable
            className={`px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 ${
              loadingUnlink ? 'opacity-60' : ''
            }`}
            onPress={guard(onUnlink)}
            disabled={loadingUnlink}
          >
            {loadingUnlink ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-neutral-900 dark:text-neutral-100">
                Unlink
              </Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-neutral-600 dark:text-neutral-400">
            {needsAttention
              ? 'Needs attention'
              : disabled
              ? 'Unavailable'
              : 'Not linked'}
          </Text>

          <Pressable
            className={`px-3 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 ${
              disabled || loadingLink ? 'opacity-60' : ''
            }`}
            onPress={guard(onLink)}
            disabled={disabled || loadingLink}
          >
            {loadingLink ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white dark:text-neutral-900">
                {disabled ? 'Unavailable' : needsAttention ? 'Re-link' : 'Link'}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}
