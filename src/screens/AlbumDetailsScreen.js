// screens/AlbumDetailScreen.js
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fetchJson } from '../lib/api';

export default function AlbumDetailScreen({ route }) {
  const { provider, id } = route.params;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson(`/api/discovery/album/${provider}/${id}`, {
          auth: 'auto',
        });
        setAlbum(data);
      } catch (err) {
        console.warn('Album fetch failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [provider, id]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (!album)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Album not found.</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1">
      <LinearGradient
        colors={['#000000', '#111', '#1c1c1e']}
        className="p-6 items-center"
      >
        <Image
          source={{ uri: album.artworkUrl }}
          style={{ width: 240, height: 240, borderRadius: 16 }}
        />
        <Text className="text-2xl font-bold mt-4 text-white">
          {album.name}
        </Text>
        <Text className="text-neutral-400 mt-1">
          {album.artists?.join(', ')}
        </Text>
        {album.genre && (
          <Text className="text-neutral-500 mt-1">{album.genre}</Text>
        )}

        <View className="mt-6 bg-emerald-600 px-6 py-3 rounded-full">
          <Text
            onPress={() => console.log('Play album', album.name)}
            className="text-white font-semibold"
          >
            ▶️ Play Album
          </Text>
        </View>
      </LinearGradient>

      <View className="p-6">
        <Text className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Tracks
        </Text>
        <FlatList
          data={album.tracks || []}
          keyExtractor={t => t.id}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => console.log('Play track', item.name)}
              className="py-3 border-b border-neutral-200 dark:border-neutral-800"
            >
              <Text className="text-neutral-900 dark:text-neutral-100 font-medium">
                {index + 1}. {item.name}
              </Text>
              <Text className="text-xs text-neutral-500">
                {item.artists?.join(', ')}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
