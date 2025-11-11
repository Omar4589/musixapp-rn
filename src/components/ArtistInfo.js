// components/ArtistInfoModal.js
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { fetchJson } from '../lib/api';

export default function ArtistInfoModal({
  visible,
  onClose,
  artists = [],
  provider,
}) {
  const [artistDetails, setArtistDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          artists.map(async a => {
            const idOrName = a.id || a.name;
            const data = await fetchJson(
              `/api/discovery/artist/${provider}/${encodeURIComponent(
                idOrName,
              )}`,
              { auth: 'auto' },
            );
            return data;
          }),
        );
        setArtistDetails(results.filter(Boolean));
      } catch (err) {
        console.warn('[artist modal fetch failed]', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [visible, artists, provider]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90 justify-end">
        <View className="bg-neutral-900 rounded-t-3xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">
              Artist Info
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-emerald-400 text-base">Close</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="py-12 justify-center items-center">
              <ActivityIndicator color="#10B981" size="large" />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {artistDetails.length === 0 ? (
                <View className="py-12 justify-center items-center">
                  <Text className="text-neutral-400">
                    No artist info found.
                  </Text>
                </View>
              ) : (
                artistDetails.map((a, i) => (
                  <View
                    key={i}
                    className="mb-8 border-b border-neutral-800 pb-4"
                  >
                    {a.artworkUrl && (
                      <Image
                        source={{ uri: a.artworkUrl }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          alignSelf: 'center',
                          marginBottom: 12,
                        }}
                      />
                    )}
                    <Text className="text-white text-center text-xl font-bold mb-2">
                      {a.name}
                    </Text>
                    <Text className="text-neutral-400 text-center text-sm leading-5">
                      {a.bio
                        ? a.bio.slice(0, 400) + (a.bio.length > 400 ? '…' : '')
                        : 'No biography available.'}
                    </Text>
                    {a.genres?.length > 0 && (
                      <Text className="text-neutral-500 text-xs text-center mt-3">
                        Genres: {a.genres.join(', ')}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
