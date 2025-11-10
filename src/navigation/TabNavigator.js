import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import HomeScreen from '../screens/HomeScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import SearchScreen from '../screens/SearchScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NowPlayingBar from '../components/NowPlayingBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#10B981', // emerald-500
          tabBarInactiveTintColor: '#9CA3AF', // neutral-400
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
                size={size}
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
