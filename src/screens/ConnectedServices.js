// screens/ConnectedServices.js
import { View, Text, Platform } from 'react-native';
import ProviderCard from '../components/ProviderCard';
import { useProviders } from '../state/ProvidersStore';

const IS_IOS = Platform.OS === 'ios';

export default function ConnectedServices() {
  const { spotify, apple, linkSpotify, unlinkSpotify, linkApple, unlinkApple } =
    useProviders();

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900 px-6 py-6">
      <Text className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Connected Services
      </Text>

      <ProviderCard
        title="Spotify"
        subtitle={
          spotify.linked ? 'Linked' : 'Link to enable playback & playlists'
        }
        linked={spotify.linked}
        needsAttention={spotify.needsAttention}
        onLink={() => linkSpotify()}
        onUnlink={() => unlinkSpotify()}
      />

      {IS_IOS && (
        <ProviderCard
          title="Apple Music"
          subtitle={apple.linked ? 'Linked' : 'iOS only'}
          linked={apple.linked}
          needsAttention={apple.needsAttention}
          onLink={() =>
            linkApple(async () => {
              // TODO: MusicKit bridge: return await MusicKit.getUserToken();
              return null;
            })
          }
          onUnlink={() => unlinkApple()}
        />
      )}
    </View>
  );
}
