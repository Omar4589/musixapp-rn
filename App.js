import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind'; // 👈 use this one, not react-native
import RootNavigator from './src/navigation/RootNavigator';
import { useAuth } from './src/state/AuthStore';
import './global.css';
import Toast from 'react-native-toast-message';

const App = () => {
  const { colorScheme } = useColorScheme(); // 'light' | 'dark'
  const { init } = useAuth();
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await init(); // 🔥 run once here, nowhere else
      } finally {
        setBootReady(true);
      }
    })();
  }, [init]);

  if (!bootReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          className={`${
            colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'
          } flex-1`}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
     
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
        />
        <RootNavigator />
        <Toast />
   
    </SafeAreaProvider>
  );
};

export default App;
