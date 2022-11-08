import Index from './src/index'
import {NativeRouter} from "react-router-native";
import 'expo-dev-client'
import {useEffect} from "react";
import * as Linking from 'expo-linking'

export default function App() {

  return (
      <NativeRouter>
        <Index />
      </NativeRouter>
  )
}
