import {StyleSheet, Text, View, Linking, BackHandler} from "react-native";
import {Pressable} from "@react-native-material/core";
import {Appbar} from "react-native-paper";
import {DarkTheme} from "../../../config";
import * as React from "react";
import * as WebBrowser from 'expo-web-browser'
import {Route, Routes, useNavigate} from "react-router-native";
import DisplayMenu from "./displayMenu";
import DisplayServices from "./displayServices";
import ChooseAction from "./chooseAction";
import {useContext, useEffect} from "react";
import {HistoryContext} from "../../historyContext";

export default function CreateArea() {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)

	const backAction = () => {
		navigate(history.prev)
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<View style={styles.mainSection}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.BackAction icon="arrow-left" color="white" onPress={() => {
					navigate(history.prev)
				}}/>
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
