// SpotifyService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

class SpotifyService {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://api.spotify.com/v1';
  }

  async getAvailableDevices() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/player/devices`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data.devices;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  async getPlaybackState() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/player`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const { progress_ms, item } = response.data;
      return {
        progress: progress_ms / item.duration_ms,
        duration: item.duration_ms,
      };
    } catch (error) {
      console.error('Error fetching playback state:', error);
      return { progress: 0, duration: 0 };
    }
  }

  async playPauseTrack(deviceId, songUri, isPlaying) {
    const action = isPlaying ? 'pause' : 'play';
    try {
      await axios.put(
        `${this.baseUrl}/me/player/${action}`,
        { uris: [songUri] },
        { headers: { Authorization: `Bearer ${this.token}` }, params: { device_id: deviceId } }
      );
    } catch (error) {
      console.error(`${action} error:`, error);
    }
  }

  async skipTrack(direction, deviceId) {
    try {
      await axios.post(`${this.baseUrl}/me/player/${direction}`, {}, {
        headers: { Authorization: `Bearer ${this.token}` },
        params: { device_id: deviceId }
      });
    } catch (error) {
      console.error(`Error skipping to ${direction} track:`, error);
    }
  }

  async setShuffleState(deviceId, state) {
    try {
      await axios.put(
        `${this.baseUrl}/me/player/shuffle?state=${state}`,
        {},
        { headers: { Authorization: `Bearer ${this.token}` }, params: { device_id: deviceId } }
      );
    } catch (error) {
      console.error('Error toggling shuffle:', error);
    }
  }

  async seekToPosition(deviceId, positionMs) {
    try {
      await axios.put(
        `${this.baseUrl}/me/player/seek`,
        {},
        { headers: { Authorization: `Bearer ${this.token}` }, params: { position_ms: positionMs, device_id: deviceId } }
      );
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  async addToPlaylist(songUri) {
    try {
      const playlistId = 'your_playlist_id'; // Replace with actual playlist ID
      await axios.post(
        `${this.baseUrl}/playlists/${playlistId}/tracks`,
        { uris: [songUri] },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  }
}

export default SpotifyService;
