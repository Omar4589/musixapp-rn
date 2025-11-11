import { create } from 'zustand';
import { fetchJson, newIdemKey, setTokenHandlers } from '../lib/api';
import { saveTokens, getTokens, clearTokens } from '../lib/storage';

export const useAuth = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  init: async () => {
    // inject token handlers for api.js
    setTokenHandlers({
      getTokensFn: async () => {
        const s = get();
        if (s.accessToken && s.refreshToken)
          return { accessToken: s.accessToken, refreshToken: s.refreshToken };
        return await getTokens();
      },
      setTokensFn: async tokens => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        await saveTokens(tokens);
      },
    });

    const tokens = await getTokens();
    if (tokens?.accessToken) {
      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      try {
        const me = await fetchJson('/api/auth/me', { auth: 'auto' });
        set({ user: me.user });
      } catch {
        await clearTokens();
        set({ user: null, accessToken: null, refreshToken: null });
      }
    }
  },

  register: async ({ email, username, password, firstName, lastName }) => {
    const res = await fetchJson('/api/auth/register', {
      method: 'POST',
      body: {
        email,
        username,
        displayUsername: username,
        password,
        firstName,
        lastName,
      },
      idempotencyKey: newIdemKey(),
    });

    set({
      user: res.user,
      accessToken: res.tokens.accessToken,
      refreshToken: res.tokens.refreshToken,
    });
    await saveTokens(res.tokens);
  },

  login: async ({ emailOrUsername, password }) => {
    const res = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: { emailOrUsername, password },
    });
    set({
      user: res.user,
      accessToken: res.tokens.accessToken,
      refreshToken: res.tokens.refreshToken,
    });
    await saveTokens(res.tokens);
  },

  fetchMe: async () => {
    const res = await fetchJson('/api/auth/me', { auth: 'auto' });
    set({ user: res.user });
  },

  logout: async () => {
    const { accessToken, refreshToken } = get();
    try {
      if (accessToken) {
        await fetchJson('/api/auth/logout', {
          method: 'POST',
          auth: accessToken, // direct token is fine here
          body: { refreshToken }, // server verifies & deny-lists
        });
      }
    } catch {}
    await clearTokens();
    set({ user: null, accessToken: null, refreshToken: null });
  },

  logoutAll: async () => {
    const { accessToken, refreshToken } = get();
    try {
      if (accessToken) {
        await fetchJson('/api/auth/logout-all', {
          method: 'POST',
          auth: accessToken,
          body: { refreshToken },
        });
      }
    } catch {}
    await clearTokens();
    set({ user: null, accessToken: null, refreshToken: null });
  },

  hasPreferredLanguages: () => {
    const u = get().user;
    return (
      Array.isArray(u?.preferences?.preferredLanguages) &&
      u.preferences.preferredLanguages.length > 0
    );
  },

  updatePreferences: async ({ preferredLanguages, genres }) => {
    const body = {};
    if (preferredLanguages) body.preferredLanguages = preferredLanguages;
    if (genres) body.genres = genres;

    await fetchJson('/api/me/preferences', {
      method: 'PATCH',
      auth: 'auto',
      body,
    });
    await get().fetchMe();
  },
}));
