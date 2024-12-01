import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import SpotifyService from "../../../services/Spotify/SpotifyService";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
function SpotifyPlayer({ route, navigation }) {
  const { trackData, token } = route.params;
  const spotifyService = new SpotifyService(token);

  console.log("Track Data: ", trackData);

  const [isPlaying, setIsPlaying] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);

  const getAvailableDevices = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/devices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(response.data.devices);

      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      if (savedDeviceId) {
        const device = response.data.devices.find(dev => dev.id === savedDeviceId);
        if (device && device.is_active) {
          setSelectedDevice(device);
        } else {
          const activeDevice = response.data.devices.find(dev => dev.is_active);
          if (activeDevice) {
            setSelectedDevice(activeDevice);
            await SecureStore.setItemAsync('selectedDeviceId', activeDevice.id);
          }
        }
      } else if (response.data.devices.length > 0) {
        const firstDevice = response.data.devices[0];
        setSelectedDevice(firstDevice);
        await SecureStore.setItemAsync('selectedDeviceId', firstDevice.id);
      } else {
        alert('No available devices found.');
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlaybackState = async () => {
    const { progress, duration } = await spotifyService.getPlaybackState();
    setProgress(progress);
    setDuration(duration);
  };

  const playPauseHandler = async () => {
    if (selectedDevice) {
      await spotifyService.playPauseTrack(selectedDevice.id, trackData.songUri, isPlaying);
      setIsPlaying(!isPlaying);
    } else {
      alert("No device selected for playback.");
    }
  };

  const skipToNext = () => selectedDevice && spotifyService.skipTrack('next', selectedDevice.id);
  const skipToPrevious = () => selectedDevice && spotifyService.skipTrack('previous', selectedDevice.id);
  const toggleShuffle = async () => {
    const newShuffleState = !isShuffled;
    await spotifyService.setShuffleState(selectedDevice.id, newShuffleState);
    setIsShuffled(newShuffleState);
  };

  

  const handleSeek = async (value) => {
    setProgress(value);
    const positionMs = Math.floor(value * duration);
    await spotifyService.seekToPosition(selectedDevice.id, positionMs);
  };

  const addToPlaylist = async () => {
    await spotifyService.addToPlaylist(trackData.songUri);
    alert("Added to playlist!");
  };

  const handleRefresh = async () => {
    await getAvailableDevices(token);
  };

  useEffect(() => {
    getAvailableDevices();
    const intervalId = setInterval(() => {
      if (isPlaying) {
        getPlaybackState();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token, isPlaying]);

  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Updated to match your trackData structure */}
      <Image source={{ uri: trackData?.trackImage }} style={styles.albumImage} />
      
      <Text style={styles.trackName}>{trackData?.trackTitle || 'Track title not available'}</Text>
      <Text style={styles.artistName}>{trackData?.artistName || 'Artist name not available'}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {formatTime(progress * duration)} / {formatTime(duration)}
        </Text>
        <Progress.Bar
          progress={progress} // Progress as a number (0 to 1)
          width={300}
          height={10}
          color="#1DB954"
          borderWidth={0}
          unfilledColor="#e0e0e0"
          onTouchStart={() => {}}
          onTouchMove={(e) => handleSeek(e.nativeEvent.locationX / 300)}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={addToPlaylist}>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseHandler}>
          <Ionicons
            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
            size={60}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward-outline" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleShuffle}>
          <Ionicons
            name={isShuffled ? "shuffle" : "shuffle-outline"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="reload-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  trackName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  artistName: {
    color: "#aaa",
    fontSize: 18,
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SpotifyPlayer;
