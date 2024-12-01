// useSpotifyData.js
import { useState, useEffect } from 'react';
import { SpotifyDispService } from './SpotifyDispService';

export const useSongs = (token) => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await SpotifyDispService.getSongs(token);
      setSongs(data);
    };
    fetchData();
  }, [token]);
  return songs;
};

export const useArtists = (token) => {
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await SpotifyDispService.getArtists(token);
      setArtists(data);
    };
    fetchData();
  }, [token]);
  return artists;
};

export const useRecs = (token) => {
  const [recs, setRecs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await SpotifyDispService.getRecs(token);
      setRecs(data);
    };
    fetchData();
  }, [token]);
  return recs;
};

export const usePlaylists = (token, user) => {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await SpotifyDispService.getPlaylists(token, user);
      setPlaylists(data);
    };
    fetchData();
  }, [token, user]);
  return playlists;
};

export const useUserDetails = (token) => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const data = await SpotifyDispService.getUserDetails(token);
      setUser(data);
    };
    fetchData();
  }, [token]);
  return user;
};
