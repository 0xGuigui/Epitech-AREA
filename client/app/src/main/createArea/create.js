import {StyleSheet, Text, View, Linking} from "react-native";
import {Pressable} from "@react-native-material/core";
import {Appbar} from "react-native-paper";
import {DarkTheme} from "../../../config";
import * as React from "react";
import * as WebBrowser from 'expo-web-browser'
import {Route, Routes} from "react-router-native";
import DisplayMenu from "./displayMenu";
import DisplayServices from "./displayServices";
import ChooseAction from "./chooseAction";

export default function CreateArea() {

	return (
		<View style={styles.mainSection}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Content title="Create a new area" titleStyle={{color: 'white'}}/>
			</Appbar.Header>
			<Routes>
				<Route exact path='/' element={<DisplayMenu />}/>
				<Route exact path='/:serviceType' element={<DisplayServices />} />
				<Route exact path='/:serviceType/:serviceName' element={<ChooseAction />} />
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
