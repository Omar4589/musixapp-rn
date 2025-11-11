// components/TrackCard.js
import { Pressable, View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function TrackCard({ item, onPress, onLongPress }) {
  if (!item) return null;
  return (
    <Pressable
      className="mr-5 w-36 active:opacity-80"
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
    >
      <View className="rounded-xl overflow-hidden relative shadow-md shadow-black/20 dark:shadow-white/10">
        <Image
          source={{ uri: item.artworkUrl }}
          style={{
            width: 144,
            height: 144,
            borderRadius: 12,
            resizeMode: 'cover',
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.55)']}
          className="absolute bottom-0 left-0 right-0 h-20"
        />
        <View className="absolute bottom-2 left-2 right-2"></View>
      </View>
      <View className="mt-2">
        <Text
          numberOfLines={1}
          className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-xs text-neutral-500 dark:text-neutral-400"
        >
          {Array.isArray(item.artists)
            ? item.artists.map(a => a.name).join(', ')
            : item.artists || ''}
        </Text>
      </View>
    </Pressable>
  );
}
