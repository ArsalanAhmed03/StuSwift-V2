import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSearchResults } from '../../../services/Spotify/fetchSearchResults';
import TrackList from '../../Shared/TrackList';

// SpotifySearch Component: Handles state and business logic
function SpotifySearch({ route }) {
  const { searchString, token } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);

  const navigation = useNavigation();

  // Fetch search results based on the searchString and token
  const getSearchResults = async () => {
    setIsLoading(true);
    try {
      const results = await fetchSearchResults(searchString, token);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSearchResults();
  }, [searchString, token]);

  // Handle track selection and navigate to SpotifyPlayer
  const handleTrackPress = (track) => {
    const trackData = {
      trackImage: track.album.images[0].url,
      trackTitle: track.name,
      artistName: track.artists[0].name,
      songUri: track.uri
    };

    navigation.navigate('SpotifyPlayer', {
      trackData,
      token
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No tracks found for "{searchString}". Please try another search.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TrackList data={searchResults} onTrackPress={handleTrackPress} />
    </View>
  );
}

export default SpotifySearch;
