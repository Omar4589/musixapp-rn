// screens/AlbumDetailScreen.js
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryPillButton from '../components/PrimaryPillButton';
import SectionHeader from '../components/SectionHeader';
import TrackRowItem from '../components/TrackRowItem';
import MetaLine from '../components/MetaLine';
import { fetchJson } from '../lib/api';
import ArtistInfoModal from '../components/ArtistInfo';

export default function AlbumDetailScreen({ route, navigation }) {
  const { provider, id } = route.params;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artistModalVisible, setArtistModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Album Details' });
  }, [navigation]);

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

  const onPressTrack = useCallback(t => {
    console.log('Play track', t.name);
  }, []);

  const getItemLayout = useCallback((_, index) => {
    return { length: 56, offset: 56 * index, index };
  }, []);

  const keyExtractor = useCallback(t => t.id, []);

  // const onPressArtists = useCallback(async () => {
  //   if (!album?.artists?.length) return;
  //   setModalVisible(true);
  //   try {
  //     const results = await Promise.all(
  //       album.artists.map(async artistName => {
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
  // }, [album, provider]);

  const header = useMemo(() => {
    if (!album) return null;

    const year = album.releaseDate
      ? new Date(album.releaseDate).getFullYear().toString()
      : null;

    const metaParts = [
      album.genre || null,
      year,
      album.tracks?.length ? `${album.tracks.length} tracks` : null,
    ];

    return (
      <LinearGradient
        colors={['#000000', '#0b0b0b', '#121212']}
        className="pt-0 pb-8"
      >
        <Image
          source={{ uri: album.artworkUrl }}
          resizeMode="cover"
          style={{
            width: '100%',
            aspectRatio: 1,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        />

        <View className="px-6 items-center">
          <Text className="text-3xl font-extrabold mt-5 text-white text-center">
            {album.name}
          </Text>

          {/* clickable artist names */}
          <Pressable onPress={() => setArtistModalVisible(true)}>
            <Text
              className="text-emerald-400 mt-1 text-base underline"
              numberOfLines={1}
            >
              {album.artists?.map(a => a).join(', ')}
            </Text>
          </Pressable>

          <MetaLine parts={metaParts} className="mt-1 text-neutral-500" />

          <View className="w-full mt-8">
            <PrimaryPillButton
              title="Play Album"
              onPress={() => console.log('Play album', album.name)}
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

          <View className="w-full mt-10 mb-2 px-4">
            <SectionHeader
              title="Tracks"
              className="text-lg font-semibold text-neutral-200"
            />
          </View>
        </View>
      </LinearGradient>
    );
  }, [album]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!album) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-neutral-200">Album not found.</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        <FlatList
          data={album.tracks || []}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }) => (
            <TrackRowItem
              index={index + 1}
              title={item.name}
              subtitle={item.artists?.join(', ')}
              durationMs={item.durationMs}
              onPress={() => onPressTrack(item)}
              onLongPress={() => console.log('Long press track', item.name)}
            />
          )}
          getItemLayout={getItemLayout}
          windowSize={10}
          maxToRenderPerBatch={12}
          initialNumToRender={12}
          removeClippedSubviews
          ListHeaderComponent={header}
          ListFooterComponent={<View style={{ height: 24 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Artist Modal */}
      <ArtistInfoModal
        visible={artistModalVisible}
        onClose={() => setArtistModalVisible(false)}
        artists={album.artists}
        provider={provider}
      />
    </>
  );
}
