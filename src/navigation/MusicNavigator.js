import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SpotifyDisplay from '../components/Tabs/MusicScreens/SpotifyDisplay';
import SpotifyPlayer from '../components/Tabs/MusicScreens/SpotifyPlayer';
import SpotifyAuth from '../components/Tabs/MusicScreen';
const Stack = createStackNavigator();

export default function SpotifyNav() {
  return (
    <Stack.Navigator initialRouteName="SpotifyAuth">
    <Stack.Screen
      name="SpotifyAuth"
      component={SpotifyAuth}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SpotifyDisplay"
      component={SpotifyDisplay}
      options={{ title: 'Spotify Display' }}
    />
    <Stack.Screen
      name="SpotifyPlayer"
      component={SpotifyPlayer}
      options={{ title: 'Now Playing' }}
    />
  </Stack.Navigator>
  );
}