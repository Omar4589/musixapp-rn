// screens/ConnectYourMusic.js
import { View, Text, Platform, Alert } from 'react-native';
import ProviderCard from '../components/ProviderCard';
import { useProviders } from '../state/ProvidersStore';
import { useOAuthDeepLinks } from '../lib/deeplinks';
import Banner from '../components/Banner';
import { toast } from '../lib/toast';
import Button from '../components/Button';
import { useAuth } from '../state/AuthStore';

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
    busy,
  } = useProviders();
  const { logout } = useAuth();

  useOAuthDeepLinks(async ({ ok, provider, error }) => {
    if (ok) {
      await refresh();
      toast.success(
        provider === 'spotify'
          ? 'Connected to Spotify.'
          : 'Connected to Apple Music.',
      );
      navigation.replace('Profile');
    } else {
      if (error === 'not_premium') {
        toast.error('Spotify Premium is required to link this account.');
      } else {
        toast.error('Linking failed. Try again.');
      }
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

      {spotify.needsAttention && (
        <Banner
          type="warning"
          text="Spotify needs to be re-linked."
          ctaTitle="Re-link"
          onPress={linkSpotify}
        />
      )}

      {spotify.linked && spotify.plan !== 'premium' && (
        <Banner
          type="warning"
          text="Spotify Premium is required for full playback."
          ctaTitle="Upgrade"
          onPress={() => Linking.openURL('https://www.spotify.com/premium/')}
        />
      )}

      <ProviderCard
        title="Spotify"
        subtitle="Works on iOS and Android"
        linked={spotify.linked}
        needsAttention={spotify.needsAttention}
        onLink={linkSpotify}
        onUnlink={unlinkSpotify}
        loadingLink={busy.linkSpotify}
        loadingUnlink={busy.unlinkSpotify}
      />

      {IS_IOS && (
        <ProviderCard
          title="Apple Music"
          subtitle="iOS only"
          linked={apple.linked}
          needsAttention={apple.needsAttention}
          onLink={linkApple}
          onUnlink={unlinkApple}
          loadingLink={busy.linkApple}
          loadingUnlink={busy.unlinkApple}
        />
      )}

      {/* ---- Exit path ---- */}
      <View className="mt-10">
        <Button
          title="Log out"
          variant="secondary"
          onPress={async () => {
            await logout();
            // AuthStore clears tokens and nav tree flips to Welcome stack
          }}
        />
      </View>
    </View>
  );
}
