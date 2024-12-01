import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import useSpotifyTracks from '../../../services/Spotify/useSpotifyTracks';

function SpotifyAlbums({ route }) {
    const { albumData, token } = route.params;
    const { albumTracks, trackImages } = useSpotifyTracks(albumData.albumId, token);
    const navigation = useNavigation();

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
                data={albumTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ flexDirection: 'row', padding: 10 }}
                        onPress={() => handleTrackPress(item)}
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
