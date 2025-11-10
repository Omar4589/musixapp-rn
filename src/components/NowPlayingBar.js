import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NowPlayingBar() {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <Pressable
        className="mx-3 mb-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 px-4 py-3"
        onPress={() => {}}
      >
        <Text className="text-white dark:text-neutral-100 font-semibold">
          Not playing
        </Text>
        <Text className="text-neutral-300 dark:text-neutral-400 text-xs">
          Player coming soon
        </Text>
      </Pressable>
    </View>
  );
}
