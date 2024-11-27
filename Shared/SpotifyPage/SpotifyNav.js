import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SpotifyDisplay from './screens/SpotifyDisplay';
import SpotifyPlayer from './screens/SpotifyPlayer';
import SpotifyAuth from './SpotifyAuth';
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