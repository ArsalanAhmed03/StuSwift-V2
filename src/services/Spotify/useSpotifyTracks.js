import { useState, useEffect } from 'react';
import fetchAlbumTracks from './fetchAlbumTracks';
import fetchTrackDetails from './fetchTrackDetails';

function useSpotifyTracks(albumId, token) {
    const [albumTracks, setAlbumTracks] = useState([]);
    const [trackImages, setTrackImages] = useState({});

    const getAlbumTracks = async () => {
        const result = await fetchAlbumTracks({ albumId, token });
        setAlbumTracks(result.items || []);
    };

    const fetchTrackImage = async (trackId) => {
        try {
            const trackDetails = await fetchTrackDetails({ trackId, token });
            const imageUrl = trackDetails[0].url || 'https://via.placeholder.com/50';
            setTrackImages((prev) => ({
                ...prev,
                [trackId]: imageUrl,
            }));
        } catch (error) {
            console.error("Error fetching track image:", error);
        }
    };

    useEffect(() => {
        getAlbumTracks();
    }, [albumId, token]);

    useEffect(() => {
        albumTracks.forEach((track) => {
            if (track.id && !trackImages[track.id]) {
                fetchTrackImage(track.id);
            }
        });
    }, [albumTracks]);

    return { albumTracks, trackImages };
}

export default useSpotifyTracks;
