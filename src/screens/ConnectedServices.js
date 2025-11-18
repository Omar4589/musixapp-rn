// screens/ConnectedServices.js
import { View, Text, Platform, Alert } from 'react-native';
import ProviderCard from '../components/ProviderCard';
import { useNavigation } from '@react-navigation/native';
import { useProviders } from '../state/ProvidersStore';
import Banner from '../components/Banner';
import { toast } from '../lib/toast';

const IS_IOS = Platform.OS === 'ios';

export default function ConnectedServices() {
  const navigation = useNavigation();
  const {
    spotify,
    apple,
    linkSpotify,
    unlinkSpotify,
    linkApple,
    unlinkApple,
    busy,
    hasAnyProvider,
    isProviderRequired,
    activeProvider,
  } = useProviders();

  const confirmUnlink = provider => {
    Alert.alert(
      'Unlink?',
      'You’ll lose playback until you link again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            if (provider === 'spotify') await unlinkSpotify();
            else await unlinkApple();

            const any = hasAnyProvider();
            if (!any && isProviderRequired()) {
              toast.info('Link a provider to continue.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderSubtitle = (provider, linked) => {
    if (!linked) return 'Link to enable playback & playlists';
    if (activeProvider === provider) return '✅ Active';
    return 'Linked';
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900 px-6 py-6">
      <Text className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Connected Services
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
          text="Your Spotify account isn’t Premium — playback features may be disabled."
          ctaTitle="Upgrade"
          onPress={() => Linking.openURL('https://www.spotify.com/premium/')}
        />
      )}

      <ProviderCard
        title="Spotify"
        subtitle={renderSubtitle('spotify', spotify.linked)}
        linked={spotify.linked}
        needsAttention={spotify.needsAttention}
        onLink={linkSpotify}
        onUnlink={() => confirmUnlink('spotify')}
        loadingLink={busy.linkSpotify}
        loadingUnlink={busy.unlinkSpotify}
        disabled={activeProvider === 'spotify' && spotify.linked}
      />

      {IS_IOS && (
        <ProviderCard
          title="Apple Music"
          subtitle={renderSubtitle('apple', apple.linked)}
          linked={apple.linked}
          needsAttention={apple.needsAttention}
          onLink={linkApple}
          onUnlink={() => confirmUnlink('apple')}
          loadingLink={busy.linkApple}
          loadingUnlink={busy.unlinkApple}
          disabled={activeProvider === 'apple' && apple.linked}
        />
      )}
    </View>
  );
}
