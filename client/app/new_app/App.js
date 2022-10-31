import { StyleSheet, View } from 'react-native';
import WelcomePage from './src/welcome_page';
import { useEffect, useState } from "react";
import { NativeRouter, Route, Routes } from "react-router-native";

export default function App() {

  return (
    <NativeRouter>
      <View style={styles.app}>
        <Routes>
          <Route exact path="/" element={<WelcomePage />} />
        </Routes>
      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  app: {
    width: '100%',
    height: '100%',
    backgroundColor: '#212123',
  }
});
