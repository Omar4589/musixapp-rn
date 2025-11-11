import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useColorScheme } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import SearchScreen from '../screens/SearchScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NowPlayingBar from '../components/NowPlayingBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff', // 🖤🤍 header bg
          },
          headerTitleStyle: {
            color: isDark ? '#fff' : '#000', // text color
            fontWeight: '600',
          },
          headerTintColor: isDark ? '#fff' : '#000', // back arrow + icons
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: scheme === 'dark' ? '#000000f0' : '#fff',
            paddingTop:4,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 0,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: scheme === 'dark' ? '#9ca3af' : '#6b7280',
          tabBarIcon: ({ color, size }) => {
            const nameMap = {
              Home: 'house',
              Playlists: 'list',
              Search: 'magnifying-glass',
              Messages: 'message', // FA6 (not Feather’s message-circle)
              Profile: 'user',
            };
            const name = nameMap[route.name] || 'circle';
            return (
              <FontAwesome6
                name={name}
                size={22}
                color={color}
                iconStyle="solid"
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Playlists" component={PlaylistsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* pinned mini bar; safe-area aware inside */}
      {/* <NowPlayingBar /> */}
    </>
  );
}
