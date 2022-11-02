import {StyleSheet, View} from 'react-native';
import Login from './src/login';
import Settings from './src/settings'
import { useEffect, useState } from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import AppComponent from "./src/AppComponent";

export default function App() {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    // TODO getUserInfo et si good alors history.push('/')
    // if (userInfo.email)

  }, [userInfo])

  return (
      <NativeRouter>
        <View style={styles.app}>
          <Routes>
            <Route exact path="/" element={<Login setUserInfo={setUserInfo} />} />
            <Route exact path="/settings" element={<Settings userInfo={userInfo} />} />
            <Route path="*" element={<AppComponent userInfo={userInfo} />} />
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
