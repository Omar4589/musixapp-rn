import React from 'react';
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

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, init } = useAuth();
  const { refresh, spotify, apple, isProviderRequired } = useProviders();
  const [ready, setReady] = React.useState(false);
  const [providersReady, setProvidersReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await init();
      setReady(true);
    })();
  }, [init]);

  React.useEffect(() => {
    (async () => {
      if (user) {
        await refresh();
      }
      setProvidersReady(true);
    })();
  }, [user, refresh]);

  useOAuthDeepLinks(); // keep initialized at root

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasAnyProvider = spotify?.linked || apple?.linked;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          !hasAnyProvider && isProviderRequired() ? (
            <>
              <Stack.Screen
                name="ConnectYourMusic"
                component={ConnectYourMusic}
                options={{ title: 'Connect' }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
              />
              <Stack.Screen
                name="ConnectedServices"
                component={ConnectedServices}
                options={{ title: 'Connected Services' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
              />
              <Stack.Screen
                name="ConnectedServices"
                component={ConnectedServices}
                options={{ title: 'Connected Services' }}
              />
            </>
          )
        ) : (
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
