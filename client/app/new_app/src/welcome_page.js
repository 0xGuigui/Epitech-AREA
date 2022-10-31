import {View, Text, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';

export default function WelcomePage() {
  return (
    <View style={styles.welcomePage}>
      <Text style={{...styles.text}}>Welcome to the AREA Project!</Text>
      <Text style={{...styles.text2}}>TumbleWeed Spotify</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomePage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
    marginTop: 250,
  },
  text2: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
    marginTop: 250,
    fontFamily: 'GothamMedium',
  },
});
