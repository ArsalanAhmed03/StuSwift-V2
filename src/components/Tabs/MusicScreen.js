import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import SpotifyAuthButton from '../Shared/SpotifyAuthButton';
import useSpotifyAuth from '../../services/Spotify/useSpotifyAuth';
import * as AuthSession from 'expo-auth-session';


export default function SpotifyAuth({ navigation }) {
  const [buttonOpacity, setButtonOpacity] = useState(1);

  // Generate the redirect URI
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  // Use the custom hook for authentication
  const { accessToken, promptAsync, request } = useSpotifyAuth(
    redirectUri,
    (token) => {
      // Success callback
      navigation.navigate('SpotifyDisplay', { token });
    },
    (error) => {
      // Failure callback
      Alert.alert('Login Failed', error);
    }
  );

  const handlePressIn = () => setButtonOpacity(0.5);
  const handlePressOut = () => setButtonOpacity(1);
  const handlePress = () => {
    promptAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!accessToken && (
        <SpotifyAuthButton
          onPress={handlePress}
          opacity={buttonOpacity}
          isDisabled={!request}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      )}
    </View>
  );
}
