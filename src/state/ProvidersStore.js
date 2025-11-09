// state/ProvidersStore.js
import { create } from 'zustand';
import { Platform, Linking } from 'react-native';
import { fetchJson } from '../lib/api';

const PROVIDER_LINK_OPTIONAL = false; // flip via remote flag later
const IS_IOS = Platform.OS === 'ios';

export const useProviders = create((set, get) => ({
  spotify: { linked: false, linkedAt: null, scopes: [], needsAttention: false },
  apple:   { linked: false, linkedAt: null, subscriptionActive: null, needsAttention: false },
  loading: false,

  refresh: async () => {
    set({ loading: true });
    try {
      const res = await fetchJson('/api/me/providers', { auth: 'auto' });
      set({
        spotify: res.spotify || { linked: false, needsAttention: false },
        apple:   res.apple   || { linked: false, needsAttention: false },
      });
    } finally {
      set({ loading: false });
    }
  },

  linkSpotify: async () => {
    const data = await fetchJson('/api/oauth/spotify/start', { auth: 'auto' });
    // Open authUrl in external browser (in-app browser lib works too)
    await Linking.openURL(data.authUrl);
  },

  unlinkSpotify: async () => {
    await fetchJson('/api/providers/spotify/unlink', { method: 'POST', auth: 'auto' });
    await get().refresh();
  },

  linkApple: async (getMusicUserTokenFn) => {
    if (!IS_IOS) return;
    const musicUserToken = await getMusicUserTokenFn(); // pass a function from screen that calls MusicKit
    if (!musicUserToken) return;
    await fetchJson('/api/apple/token', { method: 'POST', auth: 'auto', body: { musicUserToken } });
    await get().refresh();
  },

  unlinkApple: async () => {
    await fetchJson('/api/providers/apple/unlink', { method: 'POST', auth: 'auto' });
    await get().refresh();
  },

  isProviderRequired: () => !PROVIDER_LINK_OPTIONAL,
}));
