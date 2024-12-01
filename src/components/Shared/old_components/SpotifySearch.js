import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function SpotifySearch({ route }) {
  const { searchString, token } = route.params;  // Get searchString and token from route params

  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);

  const navigation = useNavigation();  // Hook to navigate to other screens

  // Function to fetch data asynchronously
  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchString}&type=track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Search Data received: ", data);
      setSearchResults(data.tracks.items);  // Save the track items
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);  // Stop loading after data is fetched
    }
  };

  useEffect(() => {
    fetchSearchResults();  // Call async function to fetch results
  }, [searchString, token]);  // Depend on searchString and token to refetch if they change

  const handleTrackPress = (track) => {
    console.log("Track Data Received: ", track);

    const trackData = {
        trackImage: track.album.images[0].url,  // Changed from 'albums' to 'album'
        trackTitle: track.name,
        artistName: track.artists[0].name,
        songUri: track.uri
    };

    console.log("Track Data being sent to player: ", trackData);

    if (track) {
        navigation.navigate('SpotifyPlayer', {
            trackData, 
            token: token
        });
    }
};


  // Show a loading spinner until data is loaded
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  // Show message if no results
  if (!searchResults || searchResults.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No tracks found for "{searchString}". Please try another search.</Text>
      </View>
    );
  }

  // Render search results
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTrackPress(item)} style={{ flexDirection: 'row', padding: 10 }}>
            <Image source={{ uri: item.album.images[0].url }} style={{ width: 50, height: 50, marginRight: 10 }} />
            <View>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.artists[0].name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default SpotifySearch;
