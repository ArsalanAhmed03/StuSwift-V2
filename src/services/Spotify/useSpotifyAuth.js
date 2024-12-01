import { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = '60e52b498853481ca6d00f6ca3d9ed6d';
const SCOPES = ['user-read-private', 'user-read-email', 'user-library-read', 'user-follow-read', 'user-top-read', 'playlist-read-collaborative','user-modify-playback-state', 'app-remote-control', 'user-read-playback-state', 'user-read-currently-playing'];

export default function useSpotifyAuth(redirectUri, onSuccess, onFailure) {
  const [accessToken, setAccessToken] = useState(null);

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      if (access_token) {
        setAccessToken(access_token);
        onSuccess(access_token);
      } else {
        onFailure('No access token received.');
      }
    }
  }, [response]);

  return { accessToken, promptAsync, request };
}
