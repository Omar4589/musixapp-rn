// screens/ConnectYourMusic.js
import { View, Text, Platform, Alert } from 'react-native';
import ProviderCard from '../components/ProviderCard';
import { useProviders } from '../state/ProvidersStore';
import { useOAuthDeepLinks } from '../lib/deeplinks';

const IS_IOS = Platform.OS === 'ios';

export default function ConnectYourMusic({ navigation }) {
  const {
    spotify,
    apple,
    linkSpotify,
    unlinkSpotify,
    linkApple,
    unlinkApple,
    refresh,
  } = useProviders();

  useOAuthDeepLinks(async ({ ok }) => {
    if (ok) {
      await refresh();
      navigation.replace('Profile'); // or your Tabs/Home route when you have it
    } else {
      Alert.alert('Linking failed', 'Please try again.');
    }
  });

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900 px-6 py-6">
      <Text className="text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
        Connect your music
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300 mb-6">
        Link a provider to play songs and translate lyrics.
      </Text>

      <ProviderCard
        title="Spotify"
        subtitle="Works on iOS and Android"
        linked={spotify.linked}
        needsAttention={spotify.needsAttention}
        onLink={() => linkSpotify()}
        onUnlink={() => unlinkSpotify()}
      />

      {IS_IOS && (
        <ProviderCard
          title="Apple Music"
          subtitle="iOS only"
          linked={apple.linked}
          needsAttention={apple.needsAttention}
          onLink={() =>
            linkApple(async () => {
              // You’ll wire this to MusicKit bridge later; for now return null to skip
              // return await MusicKit.getUserToken();
              return null;
            })
          }
          onUnlink={() => unlinkApple()}
        />
      )}
    </View>
  );
}
