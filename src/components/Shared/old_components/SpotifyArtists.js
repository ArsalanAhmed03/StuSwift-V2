import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import fetchArtistsTracks from "../data/fetchArtistsTracks";

function SpotifyArtists({ route, navigation }) {
  const { artistId, token } = route.params;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleTrackPress = (track) => {
    console.log("Data Received: ", track);

    // Access album image and fallback to a placeholder if not available
    const albumImage = track.album?.images[0]?.url || 'https://via.placeholder.com/50';

    // Access artist name, fall back to 'Unknown Artist' if not available
    const artistName = track.artists?.[0]?.name || 'Unknown Artist';

    // Access track name and URI
    const trackTitle = track.name;
    const songUri = track.uri;

    // Navigation to SpotifyPlayer with track details
    navigation.navigate('SpotifyPlayer', {
        trackData: {
            trackImage: albumImage,
            trackTitle,
            artistName,
            songUri,
        },
        token,
    });
};

  useEffect(() => {
    const getArtistTracks = async () => {
      try {
        const artistTracks = await fetchArtistsTracks(artistId, token);
        setTracks(artistTracks);
      } catch (err) {
        setError("Failed to fetch artist's top tracks.");
      } finally {
        setLoading(false);
      }
    };

    getArtistTracks();
  }, [artistId, token]);

  


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text>Loading top tracks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Tracks</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.trackItem}
            onPress={() => handleTrackPress(item)}
          >
            <Image
              source={{ uri: item.album.images[0]?.url || "https://via.placeholder.com/100" }}
              style={styles.albumImage}
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{item.name}</Text>
              <Text style={styles.trackSubtitle}>{item.album.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

export default SpotifyArtists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trackSubtitle: {
    fontSize: 14,
    color: "gray",
  },
});
