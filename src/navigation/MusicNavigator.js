import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SpotifyDisplay from "../components/Tabs/MusicScreens/SpotifyDisplay";
import SpotifyPlayer from "../components/Tabs/MusicScreens/SpotifyPlayer";
import MusicScreen from "../components/Tabs/MusicScreen";
import SpotifySearch from "../components/Tabs/MusicScreens/SpotifySearch";
import SpotifyAlbums from "../components/Tabs/MusicScreens/SpotifyAlbums";
import SpotifyArtists from "../components/Tabs/MusicScreens/SpotifyArtists";

const Stack = createStackNavigator();

export default function SpotifyNav() {
  return (
    <Stack.Navigator initialRouteName="MusicScreen" >
      <Stack.Screen
        name="MusicScreen"
        component={MusicScreen}
        options={{ headerShown: false, title: "Log In" }}
      />
      <Stack.Screen
        name="SpotifyDisplay"
        component={SpotifyDisplay}
        options={{ title: "Home Page" }}
      />
      <Stack.Screen
        name="SpotifyPlayer"
        component={SpotifyPlayer}
        options={{ title: "Now Playing" }}
      />

      <Stack.Screen
        name="SpotifySearch"
        component={SpotifySearch}
        options={{ title: "Search" }}
      />

      <Stack.Screen
        name="SpotifyAlbums"
        component={SpotifyAlbums}
        options={{ title: "Album Tracks" }}
      />

      <Stack.Screen
        name="SpotifyArtists"
        component={SpotifyArtists}
        options={{ title: "Artist Tracks" }}
      />
    </Stack.Navigator>
  );
}
