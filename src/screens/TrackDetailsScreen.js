// screens/TrackDetailScreen.js
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryPillButton from '../components/PrimaryPillButton';
import MetaLine from '../components/MetaLine';
import { fetchJson } from '../lib/api';
import ArtistInfoModal from '../components/ArtistInfo';

export default function TrackDetailScreen({ route, navigation }) {
  const { provider, id } = route.params;
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artistModalVisible, setArtistModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Track Details' });
  }, [navigation]);

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

  // const onPressArtists = async () => {
  //   if (!track?.artists?.length) return;
  //   setModalVisible(true);
  //   try {
  //     const results = await Promise.all(
  //       track.artists.map(async artistName => {
  //         try {
  //           const data = await fetchJson(
  //             `/api/discovery/artist/${provider}/${encodeURIComponent(
  //               artistName,
  //             )}`,
  //             { auth: 'auto' },
  //           );
  //           return data;
  //         } catch {
  //           return { name: artistName, bio: null };
  //         }
  //       }),
  //     );
  //     setArtistDetails(results.filter(Boolean));
  //   } catch (err) {
  //     console.warn('artist fetch failed', err);
  //   }
  // };

  console.log(track?.artists);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!track) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-neutral-200">Track not found.</Text>
      </View>
    );
  }

  const metaParts = [
    track.album || null,
    track.releaseDate
      ? new Date(track.releaseDate).getFullYear().toString()
      : null,
    track.genre || null,
  ];

  return (
    <>
      <ScrollView
        className="flex-1 bg-black"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#000000', '#0b0b0b', '#121212']}
          className="pt-0 pb-8"
        >
          <Image
            source={{ uri: track.artworkUrl }}
            resizeMode="cover"
            style={{
              width: '100%',
              aspectRatio: 1,
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
            }}
          />
          <View className="px-6 items-center mt-6">
            <Text className="text-3xl font-extrabold mt-5 text-white text-center">
              {track.name}
            </Text>

            {/* Tappable Artist Names */}
            <Pressable onPress={() => setArtistModalVisible(true)}>
              <Text
                className="text-neutral-300 mt-2 text-base underline decoration-neutral-600"
                numberOfLines={1}
              >
                {track.artists?.map(a => a).join(', ')}
              </Text>
            </Pressable>

            <MetaLine parts={metaParts} className="mt-1 text-neutral-500" />

            <View className="w-full mt-8">
              <PrimaryPillButton
                title="Play"
                onPress={() => console.log('Play track', track.name)}
              />
            </View>

            {/* secondary actions */}
            <View className="w-full flex-row justify-center gap-x-3 mt-4">
              <View className="px-4 py-2 rounded-full border border-neutral-700">
                <Text className="text-neutral-200">Add</Text>
              </View>
              <View className="px-4 py-2 rounded-full border border-neutral-700">
                <Text className="text-neutral-200">Share</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Artist Info Modal */}
      <ArtistInfoModal
        visible={artistModalVisible}
        onClose={() => setArtistModalVisible(false)}
        artists={track.artists}
        provider={provider}
      />
    </>
  );
}
