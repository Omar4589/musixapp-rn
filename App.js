import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind'; // 👈 use this one, not react-native
import RootNavigator from './src/navigation/RootNavigator';
import { useAuth } from './src/state/AuthStore';
import './global.css';

const App = () => {
  const { colorScheme } = useColorScheme(); // 'light' | 'dark'
  const { init } = useAuth();

  useEffect(() => {
    init().catch(() => {});
  }, [init]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={`flex-1 ${
          colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'
        }`}
      >
        <RootNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
