// spotifyService.js
import fetchSongs from "./fetchSongs";
import fetchArtists from "./fetchArtists";
import fetchRecs from "./fetchRecs";
import fetchPlaylists from "./fetchPlaylists";
import fetchUserDetails from "./fetchUserDetails";

export const SpotifyDispService = {
  getSongs: async (token) => {
    try {
      const result = await fetchSongs(token);
      return result.items;
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  },

  getArtists: async (token) => {
    try {
      const result = await fetchArtists(token);
      return result.artists.items;
    } catch (error) {
      console.error("Error fetching artists:", error);
      return [];
    }
  },

  getRecs: async (token) => {
    try {
      const result = await fetchRecs(token);
      return result;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  },

  getPlaylists: async (token, user) => {
    try {
      const result = await fetchPlaylists(token, user);
      return result;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      return [];
    }
  },

  getUserDetails: async (token) => {
    try {
      const result = await fetchUserDetails(token);
      return result.uri;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return '';
    }
  },
};
