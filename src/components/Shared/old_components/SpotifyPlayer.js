import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons instead of MaterialIcons
import axios from "axios";
import * as Progress from "react-native-progress";
import * as SecureStore from "expo-secure-store";

function SpotifyPlayer({ route, navigation }) {
  const { trackData, token } = route.params;
  
  const trackImage = trackData.trackImage;
  const trackTitle = trackData.trackTitle;
  const artistName = trackData.artistName;
  const songUri = trackData.songUri;

  const [isPlaying, setIsPlaying] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [progress, setProgress] = useState(0); // Progress is a number between 0 and 1
  const [duration, setDuration] = useState(0); // Duration in ms
  const [loading, setLoading] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false); // Shuffle state
  const [mix, setMix] = useState(false); // Mix state

  // Fetch available devices
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

  // Fetch playback state
  const getPlaybackState = async (token) => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { progress_ms, item } = response.data;
      setProgress(progress_ms / item.duration_ms); // Set progress as a fraction (0 to 1)
      setDuration(item.duration_ms); // Set track duration in ms
    } catch (error) {
      console.error("Error fetching playback state:", error);
    }
  };

  // Play or pause the track
  const playPauseHandler = async () => {
    if (!selectedDevice) {
      alert("No device selected for playback.");
      return;
    }

    try {
      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      const deviceId = selectedDevice.id || savedDeviceId;

      if (isPlaying) {
        await axios.put("https://api.spotify.com/v1/me/player/pause", {}, {
          headers: { Authorization: `Bearer ${token}` },
          params: { device_id: deviceId },
        });
        setIsPlaying(false);
      } else {
        await axios.put("https://api.spotify.com/v1/me/player/play", { uris: [songUri] }, {
          headers: { Authorization: `Bearer ${token}` },
          params: { device_id: deviceId },
        });
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  // Skip to next track
  const skipToNext = async () => {
    try {
      if (!selectedDevice) {
        alert("No device selected for playback.");
        return;
      }

      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      const deviceId = selectedDevice.id || savedDeviceId;

      await axios.post("https://api.spotify.com/v1/me/player/next", {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { device_id: deviceId },
      });
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  // Skip to previous track
  const skipToPrevious = async () => {
    try {
      if (!selectedDevice) {
        alert("No device selected for playback.");
        return;
      }

      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      const deviceId = selectedDevice.id || savedDeviceId;

      await axios.post("https://api.spotify.com/v1/me/player/previous", {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { device_id: deviceId },
      });
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  };

  // Handle seeking on the progress bar
  const handleSeek = async (value) => {
    setProgress(value); // Update progress as per user interaction
    const position_ms = Math.floor(value * duration); // Convert progress to milliseconds

    // Ensure position_ms is within valid bounds (0 to duration)
    if (position_ms < 0 || position_ms > duration) {
      console.error("Invalid position for seeking");
      return;
    }

    try {
      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      const deviceId = selectedDevice.id || savedDeviceId;

      // Make the seek request to Spotify
      await axios.put("https://api.spotify.com/v1/me/player/seek", {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { position_ms, device_id: deviceId },
      });
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  // Toggle shuffle
  const toggleShuffle = async () => {
    try {
      const savedDeviceId = await SecureStore.getItemAsync('selectedDeviceId');
      const deviceId = selectedDevice.id || savedDeviceId;

      await axios.put(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffled}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        params: { device_id: deviceId },
      });

      setIsShuffled(!isShuffled);
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  };

  // Toggle mix (crossfade or other feature)
  const toggleMix = () => {
    // Implement the mix feature (this is a placeholder)
    setMix(!mix);
  };

  // Refresh devices manually
  const handleRefresh = async () => {
    await getAvailableDevices(token);
  };

  // Add to playlist
  const addToPlaylist = async () => {
    try {
      const playlistId = "your_playlist_id"; // Replace with the actual playlist ID
      await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        uris: [songUri],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Added to playlist!");
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  };

  useEffect(() => {
    getAvailableDevices(token);
    const intervalId = setInterval(() => {
      if (isPlaying) {
        getPlaybackState(token);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token, isPlaying]);

  // Format time for display
  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: trackImage }} style={styles.albumImage} />
      <Text style={styles.trackName}>{trackTitle}</Text>
      <Text style={styles.artistName}>{artistName}</Text>

      {/* Refresh Button */}
      

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
