import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../state/AuthStore';
import { useUI } from '../state/UIStore';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useProviders } from '../state/ProvidersStore';

const ProfileScreen = () => {
  const { user, fetchMe, logout, logoutAll } = useAuth();
  const { theme, setTheme } = useUI();
  const navigation = useNavigation();
  const { spotify, apple, isProviderRequired } = useProviders();

  // belt & suspenders: if gated, bounce to Connect as root
  useEffect(() => {
    const mustLink = isProviderRequired();
    const hasAny = !!(spotify?.linked || apple?.linked);
    if (mustLink && !hasAny) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ConnectYourMusic' }],
        }),
      );
    }
  }, [spotify?.linked, apple?.linked, isProviderRequired, navigation]);

  useEffect(() => {
    fetchMe().catch(() => {});
  }, [fetchMe]);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <Text className="text-neutral-900 dark:text-neutral-100">Loading…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 py-6 bg-white dark:bg-neutral-900">
      <Text className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
        Profile
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300 mb-1">
        Email: {user.email}
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300 mb-1">
        Username: {user.username}
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300 mb-6">
        Languages: {user?.preferences?.preferredLanguages?.join(', ') || '—'}
      </Text>

      <Button
        title="Connected Services"
        onPress={() => navigation.navigate('ConnectedServices')}
        className="mb-6"
      />

      <Text className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        Theme
      </Text>
      <View className="flex-row gap-x-2 mb-6">
        <Button
          title="System"
          variant={theme === 'system' ? 'primary' : 'secondary'}
          onPress={() => setTheme('system')}
        />
        <Button
          title="Light"
          variant={theme === 'light' ? 'primary' : 'secondary'}
          onPress={() => setTheme('light')}
        />
        <Button
          title="Dark"
          variant={theme === 'dark' ? 'primary' : 'secondary'}
          onPress={() => setTheme('dark')}
        />
      </View>

      <Button title="Log out" onPress={logout} className="mb-3" />
      <Button
        title="Log out everywhere"
        onPress={logoutAll}
        variant="secondary"
      />
    </View>
  );
};

export default ProfileScreen;
