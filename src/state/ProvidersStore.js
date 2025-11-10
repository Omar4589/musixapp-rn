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
        spotify: res.spotify || { linked: false, needsAttention: false },
        apple: res.apple || { linked: false, needsAttention: false },
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

  linkSpotify: async () => {
    set(state => ({ busy: { ...state.busy, linkSpotify: true } }));
    try {
      const data = await fetchJson('/api/oauth/spotify/start', {
        auth: 'auto',
      });
      await Linking.openURL(data.authUrl);
      // success toast comes after deep-link callback once refresh confirms
    } catch (e) {
      console.warn('Spotify link start failed', e);
      toast.error('Couldn’t start Spotify link. Try again.');
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

  linkApple: async () => {
    if (!IS_IOS) return;
    set(state => ({ busy: { ...state.busy, linkApple: true } }));
    try {
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
    } catch (e) {
      console.warn('Apple link failed', e);
      toast.error('Couldn’t link Apple Music. Try again.');
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
