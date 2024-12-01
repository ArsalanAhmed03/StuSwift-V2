import { useState, useEffect } from 'react';
import fetchArtistsTracks from './fetchArtistsTracks';


const usefetchTracks = (artistId, token) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetchArtistsTracks(artistId, token);
        setTracks(response);
      } catch (err) {
        setError("Failed to fetch artist's top tracks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [artistId, token]);

  return { tracks, loading, error };
};

export default usefetchTracks;
