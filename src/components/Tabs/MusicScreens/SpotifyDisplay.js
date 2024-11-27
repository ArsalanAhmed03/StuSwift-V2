import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, SafeAreaView, TextInput, ScrollView, Pressable } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import fetchSongs from "../../../services/Firebase/fetchSongs";
import fetchArtists from "../../../services/Firebase/fetchArtists";
import fetchRecs from "../../../services/Firebase/fetchRecs";

const SpotifyDisplay = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, onChangeText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params; // Access token from navigation route params

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Inter_400Regular, 
    Inter_700Bold
  });

  const getSongs = async () => {
    try {
      console.log("Token received for songs: ", token);
      const result = await fetchSongs(token);
      setSongs(result.items); 
    } catch (error) {
      console.error("Error fetching songs: ", error);
    }
  };

  const getArtists = async () => {
    try {
      console.log("Token received for artists: ", token);
      const result = await fetchArtists(token);
      setArtists(result.artists.items); 
      console.log("Artists received: ", result);
    } catch (error) {
      console.error("Error fetching artists: ", error);
    }
  };

  const getRecs = async () => {
    try {
      const result = await fetchRecs(token);
      setRecs(result); 
      console.log("Recommendations received: ", result);
    } catch (error) {
      console.error("Error fetching recommendations: ", error);
    }
  };

  useEffect(() => {
    console.log("Token Received: ", token)
    const fetchData = async () => {
      await getSongs();
      await getArtists();
      await getRecs();
      setLoading(false); 
    };
    fetchData();
  }, [token]);

  if (!fontsLoaded) {
    console.log("Fonts not Loaded");
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text>Fetching your songs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView> 
        <Pressable style={styles.topBox}>
          <Text style={styles.ScreenTitle}>Music</Text>
        </Pressable>

        <View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          /> 
        </View>

        <Text style={styles.savedSongsTitle}>Featured</Text> 
        <FlatList
          data={recs.playlists.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const albumImage = item.images?.[0]?.url || 'https://via.placeholder.com/100';
            return (
              <Pressable style={styles.songItem}>
                <Image source={{ uri: albumImage }} style={styles.albumImage} />
                <Text style={styles.songTitle}>{item.name}</Text>
              </Pressable>
            );
          }}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.savedSongsTitle}>Your Saved Tracks</Text>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.track.id.toString()}
          renderItem={({ item }) => {
            const albumImage = item.track.album?.images?.[0]?.url || 'https://via.placeholder.com/100';
            return (
              <Pressable 
                style={styles.songItem} 
                onPress={() => {
                  const trackData = {
                    trackImage: albumImage,
                    trackTitle: item.track.name,
                    artistName: item.track.artists[0].name,
                    songUri: item.track.uri
                  };
                  console.log("Data being sent: ", trackData)
                  navigation.navigate("SpotifyPlayer", { trackData });
                }}
              >
                <Image source={{ uri: albumImage }} style={styles.albumImage} />
                <Text style={styles.songTitle}>{item.track.name}</Text>
                <Text style={styles.artistName}>{item.track.artists[0].name}</Text>
              </Pressable>
            );
          }}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.savedSongsTitle}>Your Followed Artists</Text>
        <FlatList
          data={artists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const artistImage = item.images?.[0]?.url || 'https://via.placeholder.com/100';
            return (
              <Pressable style={styles.songItem}>
                <Image source={{ uri: artistImage }} style={styles.albumImage} />
                <Text style={styles.songTitle}>{item.name}</Text>
              </Pressable>
            );
          }}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 3, backgroundColor: "#fff" },
  ScreenTitle: { fontSize: 30, fontFamily: "Montserrat_700Bold", textAlign: "center" },
  loadingContainer: { flex: 4, justifyContent: "center", alignItems: "center" },
  savedSongsTitle: { fontSize: 25, fontFamily: "Inter_400Regular", marginVertical: 10 },
  songItem: { padding: 10, alignItems: "center", marginHorizontal: 0 },
  songTitle: { fontSize: 16, fontFamily: "Inter_400Regular", width: 120, textAlign: "center" },
  artistName: { fontSize: 13, color: "#555", fontFamily: "Inter_400Regular", textAlign: "center" },
  albumImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 10 },
  horizontalList: { paddingVertical: 10, paddingHorizontal: 0, marginHorizontal: 0, borderWidth: 0, borderColor: 'transparent' },
  input: { height: 40, margin: 12, borderWidth: 1, padding: 10 },
  topBox: { justifyContent: "center", alignItems: "center" },
});

export default SpotifyDisplay;
