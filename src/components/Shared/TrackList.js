import React from 'react';
import { FlatList, TouchableOpacity, Text, Image, View } from 'react-native';

const TrackList = ({ data, onTrackPress }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onTrackPress(item)} style={{ flexDirection: 'row', padding: 10 }}>
          <Image source={{ uri: item.album.images[0].url }} style={{ width: 50, height: 50, marginRight: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.artists[0].name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default TrackList;
