import {StyleSheet, Text, View, Linking} from "react-native";
import {Pressable} from "@react-native-material/core";
import {Appbar} from "react-native-paper";
import {DarkTheme} from "../../../config";
import * as React from "react";
import * as WebBrowser from 'expo-web-browser'
import {Route, Routes} from "react-router-native";
import DisplayMenu from "./displayMenu";
import DisplayServices from "./displayServices";

export default function CreateArea() {

	return (
		<View style={styles.mainSection}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Content title="Create a new action" titleStyle={{color: 'white'}}/>
			</Appbar.Header>
			<Routes>
				<Route exact path='/' element={<DisplayMenu />}/>
				<Route path='/action' element={<DisplayServices serviceType='action' />} />
				<Route path='/reaction' element={<DisplayServices serviceType='reaction' />} />
			</Routes>
		</View>
	)
}

const styles = StyleSheet.create({
	mainSection: {
		width: '100%',
		height: '100%',
	},
	text: {
		fontSize: 40,
		marginTop: '10%',
		marginBottom: '10%',
		marginRight: 'auto',
		marginLeft: '3%',
		color: '#FFFFFF'
	}

});
