import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

// For emulator defaults; switch to your LAN IP for devices if needed
// const DEV_BASE = isAndroid ? 'https://makapp-server-fa403146ca6f.herokuapp.com' : 'http://localhost:3001';
const PROD_BASE = 'https://makapp-server-fa403146ca6f.herokuapp.com';
// NOTE: on physical devices in dev, swap DEV_BASE to your LAN IP:
 const DEV_BASE = 'http://192.168.1.181:3001';

export const API_BASE = __DEV__ ? DEV_BASE : PROD_BASE;

export const newIdemKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;

// ---- token handler plumbin' (injected by AuthStore) ----
let getTokens = async () => null;
let setTokens = async _t => {};

export const setTokenHandlers = ({ getTokensFn, setTokensFn }) => {
  if (typeof getTokensFn === 'function') getTokens = getTokensFn;
  if (typeof setTokensFn === 'function') setTokens = setTokensFn;
};

// ---- low-level fetch ----
const doFetch = async (path, { method = 'GET', headers = {}, body } = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return json || {};
};

// ---- high-level fetch with auth + refresh-once ----
// opts.auth: string token | 'auto' | falsy
export const fetchJson = async (path, opts = {}) => {
  const { method = 'GET', body, auth, idempotencyKey } = opts;
  const baseHeaders = {};
  if (idempotencyKey) baseHeaders['Idempotency-Key'] = idempotencyKey;

  const attempt = async token =>
    doFetch(path, {
      method,
      headers: token
        ? { ...baseHeaders, Authorization: `Bearer ${token}` }
        : baseHeaders,
      body,
    });

  // resolve access
  let access = null;
  if (auth === 'auto') {
    const t = await getTokens();
    access = t?.accessToken || null;
  } else if (typeof auth === 'string') {
    access = auth;
  }

  try {
    return await attempt(access);
  } catch (e) {
    // try one refresh on 401 if using auto
    if (e.status === 401 && auth === 'auto') {
      const tokens = await getTokens();
      const refreshToken = tokens?.refreshToken;
      if (!refreshToken) throw e;

      // rotate on server
      const refreshed = await doFetch('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      });

      const newTokens = refreshed?.tokens;
      if (!newTokens?.accessToken || !newTokens?.refreshToken) throw e;

      await setTokens(newTokens);
      return await attempt(newTokens.accessToken);
    }
    throw e;
  }
};
