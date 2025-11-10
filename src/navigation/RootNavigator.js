import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../state/AuthStore';
import { useProviders } from '../state/ProvidersStore';
import { useOAuthDeepLinks } from '../lib/deeplinks';
import ConnectYourMusic from '../screens/ConnectYourMusic';
import ConnectedServices from '../screens/ConnectedServices';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user } = useAuth();
  const { refresh, spotify, apple, isProviderRequired } = useProviders();
  const [providersReady, setProvidersReady] = useState(false);

  // When user becomes truthy, fetch providers once
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user) {
        try {
          await refresh();
        } finally {
          if (mounted) setProvidersReady(true);
        }
      } else {
        // logged out state: no need to wait on providers
        setProvidersReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, refresh]);

  useOAuthDeepLinks(); // keep initialized at root

  // While deciding provider gating (after login), show a tiny spinner
  if (!providersReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasAnyProvider = !!(spotify?.linked || apple?.linked);
  const mustLink = isProviderRequired();

  return (
    <NavigationContainer
      key={user ? (mustLink && !hasAnyProvider ? 'gate' : 'main') : 'auth'}
    >
      <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
        {user ? (
          mustLink && !hasAnyProvider ? (
            // 🔒 Gate stack
            <>
              <Stack.Screen
                name="ConnectYourMusic"
                component={ConnectYourMusic}
                options={{
                  title: 'Connect',
                  headerBackVisible: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="ConnectedServices"
                component={ConnectedServices}
                options={{ title: 'Connected Services' }}
              />
            </>
          ) : (
            // ✅ Main app (tabs)
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
          )
        ) : (
          // 👤 Auth stack
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
