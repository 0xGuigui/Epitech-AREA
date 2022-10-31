import {View, Text, StyleSheet} from 'react-native';

export default function WelcomePage() {
  return (
    <View style={styles.welcomePage}>
      <Text style={styles.text}> Welcome to the app </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomePage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});
