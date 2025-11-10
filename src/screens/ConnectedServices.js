// screens/ConnectedServices.js
import { View, Text, Platform, Alert } from 'react-native';
import ProviderCard from '../components/ProviderCard';
import { useNavigation, CommonActions } from '@react-navigation/native';
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
  } = useProviders();

  // const hardGateToConnect = () => {
  //   // wipe history: ConnectYourMusic becomes the root
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{ name: 'ConnectYourMusic' }],
  //     }),
  //   );
  // };

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

            // Re-gate if last provider and required
            const any = hasAnyProvider();
            if (!any && isProviderRequired()) {
              toast.info('Link a provider to continue.');
              // hardGateToConnect();
            }
          },
        },
      ],
      { cancelable: true },
    );
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

      <ProviderCard
        title="Spotify"
        subtitle={
          spotify.linked ? 'Linked' : 'Link to enable playback & playlists'
        }
        linked={spotify.linked}
        needsAttention={spotify.needsAttention}
        onLink={linkSpotify}
        onUnlink={() => confirmUnlink('spotify')}
        loadingLink={busy.linkSpotify}
        loadingUnlink={busy.unlinkSpotify}
      />

      {IS_IOS && (
        <ProviderCard
          title="Apple Music"
          subtitle={apple.linked ? 'Linked' : 'iOS only'}
          linked={apple.linked}
          needsAttention={apple.needsAttention}
          onLink={linkApple}
          onUnlink={() => confirmUnlink('apple')}
          loadingLink={busy.linkApple}
          loadingUnlink={busy.unlinkApple}
        />
      )}
    </View>
  );
}
