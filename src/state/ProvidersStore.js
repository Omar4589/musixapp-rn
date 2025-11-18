// state/ProvidersStore.js
import { create } from 'zustand';
import { Platform, Linking } from 'react-native';
import { fetchJson } from '../lib/api';
import { authorizeAndGetUserToken } from '../native/MusicKitBridge';
import { toast } from '../lib/toast';

const IS_IOS = Platform.OS === 'ios';

export const useProviders = create((set, get) => ({
  spotify: { linked: false, linkedAt: null, scopes: [], needsAttention: false },
  apple: {
    linked: false,
    linkedAt: null,
    subscriptionActive: null,
    needsAttention: false,
  },
  activeProvider: null,
  flags: { providerLinkOptional: false, appleAndroidEnabled: false },
  loading: false,
  busy: {
    linkSpotify: false,
    unlinkSpotify: false,
    linkApple: false,
    unlinkApple: false,
  },

  refresh: async () => {
    set({ loading: true });
    try {
      const res = await fetchJson('/api/me/providers', { auth: 'auto' });
      set({
        spotify: {
          linked: res.spotify?.linked,
          linkedAt: res.spotify?.linkedAt,
          plan: res.spotify?.plan,
          needsAttention: res.spotify?.needsAttention,
        },
        apple: {
          linked: res.apple?.linked,
          linkedAt: res.apple?.linkedAt,
          subscriptionActive: res.apple?.subscriptionActive,
          needsAttention: res.apple?.needsAttention,
        },
        activeProvider: res.activeProvider,
        flags: res.flags,
      });
    } finally {
      set({ loading: false });
    }
  },

  hasAnyProvider: () => {
    const s = get().spotify?.linked;
    const a = get().apple?.linked;
    return !!(s || a);
  },

  isProviderRequired: () => !get().flags.providerLinkOptional,

  isProviderLinked: provider =>
    !!(get()[provider]?.linked && get().activeProvider === provider),

  // 🔁 Switch provider flow
  switchProvider: async (newProvider, oldProvider) => {
    try {
      toast.info(`Linking ${newProvider}...`);
      const success =
        newProvider === 'spotify'
          ? await get().linkSpotify(true)
          : await get().linkApple(true);

      if (!success) {
        toast.error('Linking failed.');
        return;
      }

      toast.info(`Finalizing switch...`);
      await fetchJson(`/api/providers/${oldProvider}/unlink`, {
        method: 'POST',
        auth: 'auto',
      });

      await get().refresh();
      toast.success(`Switched to ${newProvider}!`);
    } catch (err) {
      console.error('Switch provider failed', err);
      toast.error('Failed to switch provider');
    }
  },

  // 🎧 Spotify linking
  linkSpotify: async (isSwitchFlow = false) => {
    set(state => ({ busy: { ...state.busy, linkSpotify: true } }));
    try {
      const { activeProvider } = get();
      if (activeProvider && activeProvider !== 'spotify' && !isSwitchFlow) {
        Alert.alert(
          'Switch Music Service',
          `You’re currently linked with ${activeProvider}. Linking Spotify will replace it. Continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue',
              onPress: () => get().switchProvider('spotify', activeProvider),
            },
          ],
        );
        return;
      }

      const data = await fetchJson('/api/oauth/spotify/start', {
        auth: 'auto',
      });
      await Linking.openURL(data.authUrl);
      return true;
    } catch (e) {
      console.warn('Spotify link start failed', e);
      toast.error('Couldn’t start Spotify link. Try again.');
      return false;
    } finally {
      set(state => ({ busy: { ...state.busy, linkSpotify: false } }));
    }
  },

  unlinkSpotify: async () => {
    set(state => ({ busy: { ...state.busy, unlinkSpotify: true } }));
    try {
      await fetchJson('/api/providers/spotify/unlink', {
        method: 'POST',
        auth: 'auto',
      });
      await get().refresh();
      toast.success('Disconnected.');
    } catch (e) {
      toast.error('Couldn’t disconnect. Try again.');
    } finally {
      set(state => ({ busy: { ...state.busy, unlinkSpotify: false } }));
    }
  },

  // 🍎 Apple linking
  linkApple: async (isSwitchFlow = false) => {
    if (!IS_IOS) return;
    set(state => ({ busy: { ...state.busy, linkApple: true } }));
    try {
      const { activeProvider } = get();
      if (activeProvider && activeProvider !== 'apple' && !isSwitchFlow) {
        Alert.alert(
          'Switch Music Service',
          `You’re currently linked with ${activeProvider}. Linking Apple Music will replace it. Continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue',
              onPress: () => get().switchProvider('apple', activeProvider),
            },
          ],
        );
        return;
      }

      const { devToken } = await fetchJson('/api/apple/dev-token', {
        auth: 'auto',
      });
      const musicUserToken = await authorizeAndGetUserToken(devToken);
      await fetchJson('/api/apple/token', {
        method: 'POST',
        auth: 'auto',
        body: { musicUserToken },
      });
      await get().refresh();
      toast.success('Connected to Apple Music.');
      return true;
    } catch (e) {
      console.warn('Apple link failed', e);
      toast.error('Couldn’t link Apple Music. Try again.');
      return false;
    } finally {
      set(state => ({ busy: { ...state.busy, linkApple: false } }));
    }
  },

  unlinkApple: async () => {
    set(state => ({ busy: { ...state.busy, unlinkApple: true } }));
    try {
      await fetchJson('/api/providers/apple/unlink', {
        method: 'POST',
        auth: 'auto',
      });
      await get().refresh();
      toast.success('Disconnected.');
    } catch (e) {
      toast.error('Couldn’t disconnect. Try again.');
    } finally {
      set(state => ({ busy: { ...state.busy, unlinkApple: false } }));
    }
  },
}));
