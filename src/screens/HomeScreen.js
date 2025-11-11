import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, RefreshControl, useColorScheme } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import * as RNLocalize from 'react-native-localize';
import Button from '../components/Button';
import TrackRow from '../components/TrackRow';
import { useAuth } from '../state/AuthStore';
import { fetchJson } from '../lib/api';
import LinearGradient from 'react-native-linear-gradient'; // if not using Expo, replace with react-native-linear-gradient
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const mapCountryToStorefront = cc => {
  if (!cc) return 'us';
  const known = [
    'US',
    'MX',
    'JP',
    'GB',
    'CA',
    'BR',
    'DE',
    'FR',
    'ES',
    'IT',
    'KR',
    'IN',
    'AU',
    'NL',
    'SE',
    'NO',
    'DK',
    'FI',
  ];
  const up = cc.toUpperCase();
  return known.includes(up) ? up.toLowerCase() : 'us';
};

export default function HomeScreen({ navigation }) {
  const { hasPreferredLanguages } = useAuth();
  const needsPrefs = !hasPreferredLanguages();
  const scheme = useColorScheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { storefront, locale } = useMemo(() => {
    const locales = RNLocalize.getLocales?.() || [];
    const primary = locales[0] || { languageTag: 'en-US', countryCode: 'US' };
    return {
      storefront: mapCountryToStorefront(primary.countryCode),
      locale: primary.languageTag || 'en-US',
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = `storefront=${encodeURIComponent(
        storefront,
      )}&locale=${encodeURIComponent(locale)}`;
      const res = await fetchJson(`/api/discovery/home?${qs}`, {
        auth: 'auto',
      });
      setRows(res.rows || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [storefront, locale]);

  useEffect(() => {
    if (!needsPrefs) load();
  }, [needsPrefs, load]);

  /* ----------------------------
   * Needs Prefs screen
   * ---------------------------- */
  if (needsPrefs) {
    return (
      <LinearGradient
        colors={
          scheme === 'dark' ? ['#0d0d0d', '#1a1a1a'] : ['#ffffff', '#f3f4f6']
        }
        className="flex-1 px-6 py-6 justify-center"
      >
        <Text className="text-3xl font-extrabold mb-3 text-neutral-900 dark:text-neutral-100">
          Choose your vibe 🎧
        </Text>
        <Text className="text-base text-neutral-700 dark:text-neutral-300 mb-6">
          Pick the languages you want to explore — you can change this anytime.
        </Text>
        <Button
          title="Set Preferences"
          onPress={() => navigation.navigate('Preferences')}
        />
      </LinearGradient>
    );
  }

  /* ----------------------------
   * Home feed
   * ---------------------------- */
  console.log('rendering screen', needsPrefs, rows.length);

  return (
    <LinearGradient
      colors={
        scheme === 'dark'
          ? ['#000000', '#000000ff', '#000000ff']
          : ['#ffffff', '#fafafa', '#f0f0f0']
      }
      style={{ flex: 1 }} // use style, not className
    >
      <FlashList
        contentContainerStyle={{
          paddingTop: 6,
          paddingBottom: tabBarHeight + 32,
          paddingHorizontal: 16,
        }}
        data={rows}
        keyExtractor={r => r.key}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={scheme === 'dark' ? '#1DB954' : '#000'}
          />
        }
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              Discover
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-400 mt-1 text-base">
              Fresh tracks & charts from your favorite languages
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TrackRow title={item.title} items={item.items} />
        )}
        ListEmptyComponent={
          <View className="px-4 py-10">
            <Text className="text-neutral-700 dark:text-neutral-300 text-center">
              Nothing to show yet. Link Apple Music or pull to refresh.
            </Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
