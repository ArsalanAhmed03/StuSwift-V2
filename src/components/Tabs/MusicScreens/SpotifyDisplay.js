import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, SafeAreaView, TextInput, ScrollView, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

import { useSongs , useArtists, useRecs, usePlaylists, useUserDetails } from "../../../services/Spotify/useSpotifyData";

const SpotifyDisplay = () => {
  const [text, onChangeText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params;

  const songs = useSongs(token);
  const artists = useArtists(token);
  const recs = useRecs(token);
  const playlists = usePlaylists(token, useUserDetails(token));
  const fontsLoaded = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  const handleSubmitSearch = () => {
    if (text.trim()) {
      navigation.navigate('SpotifySearch', { searchString: text, token: token });
    }
  };

  const handleSearchIconPress = () => {
    if (text.trim()) {
      navigation.navigate('SpotifySearch', { searchString: text, token: token });
    }
  };

  const handleAlbumPress = (albumId, albumImage, albumName) => {
    console.log('Album ID:', albumId);
    console.log('Album Image:', albumImage);
    console.log('Album Name:', albumName);
    
    const albumData = {
      albumId: albumId,
      albumImage: albumImage,
      albumName: albumName
    }

    navigation.navigate('SpotifyAlbums', {albumData, token})
  };

  const handleArtistPress = (artistId) => {
    navigation.navigate('SpotifyArtists', {artistId, token});
  }

  if (!fontsLoaded) {
    return null;
  }

  if (!songs || !artists || !recs || !playlists) {
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

        <View style={styles.searchBar}>
      <Ionicons name="menu" size={20} color="#555" style={styles.searchIcon} />
      
      <TextInput
        style={styles.searchInput}
        onChangeText={onChangeText}  // Update text state as the user types
        value={text}
        placeholder="Search here"
        placeholderTextColor="#555"
        onSubmitEditing={handleSubmitSearch}  // Trigger search on Enter key press
        returnKeyType="search"  // Show the "search" button on the keyboard
        blurOnSubmit={false}  // Keep the input focused after pressing Enter
      />
      
      <Ionicons
        name="search"
        size={20}
        color="#555"
        style={styles.searchIcon}
        onPress={handleSearchIconPress}  // Trigger search on icon press
      />
    </View>

    <Text style={styles.savedSongsTitle}>Featured Albums</Text> 
    <FlatList
    data={recs?.albums?.items || []} // Fallback to an empty array if data is undefined
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => {
    const albumImage = item.images?.[0]?.url || 'https://via.placeholder.com/100';
    return (
      <Pressable
        style={styles.songItem}
        onPress={() => handleAlbumPress(item.id, albumImage, item.name)}
      >
        <Image source={{ uri: albumImage }} style={styles.albumImage} />
        <Text style={styles.songTitle}>{item.name}</Text>
      </Pressable>
    );
  }}
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalList}
/>



        <Text style={styles.savedSongsTitle}>Your Saved Tracks</Text>
        <FlatList
        data={songs || []} // Ensure songs is not undefined
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
          navigation.navigate("SpotifyPlayer", { trackData, token });
        }}
      >
        <Image source={{ uri: albumImage }} style={styles.albumImage} />
        <Text style={styles.songTitle}>{item.track.name}</Text>
        <Text style={styles.artistName}>{item.track.artists[0].name}</Text>
      </Pressable>
    );
  }}
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalList}
/>

        
        <Text style={styles.savedSongsTitle}>Your Followed Artists</Text>
        <FlatList
  data={artists || []} // Ensure artists is not undefined
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    const artistImage = item.images?.[0]?.url || 'https://via.placeholder.com/100';
    return (
      <Pressable style={styles.songItem} onPress={() => handleArtistPress(item.id)}>
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
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF", // White background for the app
      paddingHorizontal: 15,
    },
    ScreenTitle: {
      fontSize: 32,
      fontFamily: "Montserrat_700Bold",
      textAlign: "center",
      color: "#1E90FF", // Blue for the title
      marginVertical: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
    },
    savedSongsTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#1E90FF", // Blue for section titles
      marginVertical: 15,
    },
    songItem: {
      width: 120,
      alignItems: "center",
      marginHorizontal: 10,
      backgroundColor: "#F8F8F8", // Light grey card for contrast
      padding: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    songTitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "#000000", // Black for text
      textAlign: "center",
      marginTop: 8,
    },
    artistName: {
      fontSize: 12,
      color: "#555555", // Grey for secondary text
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    albumImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    horizontalList: {
      paddingVertical: 10,
    },
    input: {
      height: 40,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "#1E90FF", // Blue border for input
      borderRadius: 8,
      padding: 10,
      backgroundColor: "#FFFFFF", // White background
      color: "#000000", // Black text
      fontFamily: "Inter_400Regular",
    },
    topBox: {
      justifyContent: "center",
      alignItems: "center",
    },
    trackInfoContainer: {
      flexDirection: "row",
      backgroundColor: "#1E90FF", // Blue background for now-playing track info
      padding: 10,
      borderRadius: 10,
      marginTop: 20,
      alignItems: "center",
    },
    trackImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
    },
    trackTextContainer: {
      marginLeft: 10,
    },
    trackTitle: {
      fontSize: 16,
      color: "#FFFFFF", // White text on blue background
      fontWeight: "bold",
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F7F7F7', // Light gray or white background
      borderRadius: 20,
      paddingHorizontal: 10,
      margin: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Shadow for Android
      height: 40,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: "#555",
      paddingHorizontal: 8,
    },
    searchIcon: {
      marginHorizontal: 5,
    },
  });

export default SpotifyDisplay;
