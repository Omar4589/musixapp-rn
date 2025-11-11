import { View, Text, FlatList, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // or react-native-linear-gradient

export default function TrackRow({ title, items = [] }) {
  if (!items?.length) return null;

  return (
    <View className="mb-8">
      {/* Row title */}
      <Text className="text-xl font-extrabold mb-4 tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>

      {/* Horizontal list */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingRight: 24 }}
        renderItem={({ item }) => (
          <Pressable
            className="mr-5 w-36 active:opacity-80"
            onPress={() => console.log('Pressed track', item.name)}
          >
            <View className="rounded-xl overflow-hidden relative shadow-md shadow-black/20 dark:shadow-white/10">
              {/* Artwork with overlay */}
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
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.25)',
                  'rgba(0,0,0,0.55)',
                ]}
                className="absolute bottom-0 left-0 right-0 h-20"
              />
              {/* Optional: overlayed song name on bottom */}
              <View className="absolute bottom-2 left-2 right-2">
                <Text
                  numberOfLines={1}
                  className="text-[13px] font-semibold text-white drop-shadow-md"
                >
                  {item.name}
                </Text>
              </View>
            </View>

            {/* Song name + artist below image */}
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
                {item.artists?.[0] || ''}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
