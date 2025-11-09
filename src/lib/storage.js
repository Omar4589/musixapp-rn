import * as Keychain from 'react-native-keychain';

const SERVICE = 'musicapp-auth';

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await Keychain.setGenericPassword(
    'auth',
    JSON.stringify({ accessToken, refreshToken }),
    { service: SERVICE },
  );
};

export const getTokens = async () => {
  const res = await Keychain.getGenericPassword({ service: SERVICE });
  if (!res) return null;
  try {
    const parsed = JSON.parse(res.password);
    if (parsed?.accessToken && parsed?.refreshToken) return parsed;
    return null;
  } catch {
    return null;
  }
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({ service: SERVICE });
};
