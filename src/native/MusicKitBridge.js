import { NativeModules } from 'react-native';
const { MusicKitBridge } = NativeModules;

// Returns a Promise<string>
export async function authorizeAndGetUserToken(devToken) {
  if (!MusicKitBridge || !MusicKitBridge.authorizeAndGetUserToken) {
    throw new Error('MusicKitBridge not linked');
  }
  return await MusicKitBridge.authorizeAndGetUserToken(devToken);
}

// Optional helper if you decide to show capability info
export async function getCapabilities() {
  if (!MusicKitBridge || !MusicKitBridge.getCapabilities) {
    return { canPlaybackCatalog: false, canAddToLibrary: false };
  }
  return await MusicKitBridge.getCapabilities();
}
