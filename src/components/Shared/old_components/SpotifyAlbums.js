import fetchAlbumTracks from "../data/fetchAlbumTracks";
import fetchTrackDetails from "../data/fetchTrackDetails"; // Import the new component
import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

function SpotifyAlbums({ route }) {
    const { albumData, token } = route.params;
    const [albumtracks, setalbumtracks] = useState([]);
    const [trackImages, setTrackImages] = useState({}); // State to store track images
    const navigation = useNavigation();

    console.log("Album Data Received: ", albumData);
    console.log("Token Received: ", token);

    const getAlbumTracks = async () => {
        console.log("Token being sent: ", token);
        console.log("ID being sent: ", albumData.albumId);
        const result = await fetchAlbumTracks({ albumId: albumData.albumId, token });

        console.log("Tracks Received: ", result.items);
        setalbumtracks(result.items || []);
    };

    const fetchAndSetTrackImage = async (trackId) => {
        try {
            const trackDetails = await fetchTrackDetails({ trackId, token });

            // Log the full track details to check the structure of the response
            console.log("Track Details:", trackDetails);

            // Check if album.images exists and has values
            const imageUrl = trackDetails[0].url || 'https://via.placeholder.com/50';
            console.log("Track Image URL:", imageUrl); // Log the image URL for debugging

            setTrackImages((prev) => ({
                ...prev,
                [trackId]: imageUrl,
            }));
        } catch (error) {
            console.error("Error fetching track image:", error);
        }
    };

    useEffect(() => {
        const fetchTracks = async () => {
            await getAlbumTracks();
        };
        fetchTracks();
    }, []);

    useEffect(() => {
        // Fetch images for each track
        albumtracks.forEach((track) => {
            if (track.id && !trackImages[track.id]) {
                fetchAndSetTrackImage(track.id);
            }
        });
    }, [albumtracks]);

    const handleTrackPress = (track) => {
        navigation.navigate('SpotifyPlayer', {
            trackData: {
                trackImage: trackImages[track.id] || 'https://via.placeholder.com/50',
                trackTitle: track.name,
                artistName: track.artists[0]?.name || 'Unknown Artist',
                songUri: track.uri,
            },
            token,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={albumtracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ flexDirection: 'row', padding: 10 }}
                        onPress={() => handleTrackPress(item)} // Navigate to the SpotifyPlayer on click
                    >
                        <Image
                            source={{ uri: trackImages[item.id] || 'https://via.placeholder.com/50' }}
                            style={{ width: 50, height: 50, marginRight: 10 }}
                        />
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                            <Text>{item.artists[0]?.name || 'Unknown Artist'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default SpotifyAlbums;
