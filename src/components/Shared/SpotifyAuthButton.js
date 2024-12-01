import React from 'react';
import { Pressable, Image, Text, StyleSheet } from 'react-native';

export default function SpotifyAuthButton({ onPress, opacity, isDisabled }) {
  return (
    <Pressable
      style={[styles.button, { opacity: isDisabled ? 0.5 : opacity }]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Image
        style={styles.image}
        source={require('../../assets/images/Spotify_Primary_Logo_RGB_Green.png')}
      />
      <Text style={styles.text}>Login With Spotify</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    width: 264,
    height: 71,
  },
  image: {
    width: 56,
    height: 58,
    marginLeft: 16,
    marginRight: 14,
  },
  text: {
    color: 'white',
    fontFamily: 'montserrat',
    fontSize: 16,
  },
});
