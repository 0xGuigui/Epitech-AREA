import { StyleSheet, View } from 'react-native';
import Login from './src/login';
import { useEffect, useState } from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import MainPage from "./src/mainPage";

export default function App() {
  const [userInfo, setUserInfo] = useState({})

  return (
    <NativeRouter>
      <View style={styles.app}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/" element={<MainPage userInfo={userInfo} />} />
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
