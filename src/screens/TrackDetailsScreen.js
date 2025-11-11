// screens/TrackDetailScreen.js
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fetchJson } from '../lib/api';

export default function TrackDetailScreen({ route }) {
  const { provider, id } = route.params;
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson(`/api/discovery/track/${provider}/${id}`, {
          auth: 'auto',
        });
        setTrack(data);
      } catch (err) {
        console.warn('Track fetch failed', err);
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

  if (!track)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Track not found.</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1">
      <LinearGradient
        colors={['#000000', '#111', '#1c1c1e']}
        className="p-6 items-center"
      >
        <Image
          source={{ uri: track.artworkUrl }}
          style={{ width: 240, height: 240, borderRadius: 16 }}
        />
        <Text className="text-2xl font-bold mt-4 text-white">{track.name}</Text>
        <Text className="text-neutral-400 mt-1">
          {track.artists?.join(', ')}
        </Text>
        {track.album && (
          <Text className="text-neutral-500 mt-1">{track.album}</Text>
        )}
        {track.releaseDate && (
          <Text className="text-neutral-500 mt-1">
            {new Date(track.releaseDate).getFullYear()}
          </Text>
        )}
        {track.genre && (
          <Text className="text-neutral-500 mt-1">{track.genre}</Text>
        )}

        <View className="mt-6 bg-emerald-600 px-6 py-3 rounded-full">
          <Text
            onPress={() => console.log('Play track', track.name)}
            className="text-white font-semibold"
          >
            ▶️ Play
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
