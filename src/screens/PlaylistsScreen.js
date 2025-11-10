import React from 'react';
import { View, Text } from 'react-native';

export default function PlaylistsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
      <Text className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Playlists
      </Text>
      <Text className="text-neutral-600 dark:text-neutral-300 mt-2">
        Your playlists & shared (stub)
      </Text>
    </View>
  );
}
