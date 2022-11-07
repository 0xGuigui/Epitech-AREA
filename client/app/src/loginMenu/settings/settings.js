import {Button, TextInput, Checkbox, Text, Switch} from 'react-native-paper';
import { Appbar, MD3LightTheme } from 'react-native-paper';
import { Alert, BackHandler, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useEffect, useState } from "react";
import * as React from "react";
import { isIpDomain, isPort } from "../../utils";
import { HistoryContext } from "../../historyContext";
import { DarkTheme } from "../../../config";

export default function Settings() {
	const { history } = React.useContext(HistoryContext);
	const [formIP, setFormIP] = useState("92.148.23.72");
	const [formPort, setFormPort] = useState("8080");
	const navigate = useNavigate();
	const [checked, setChecked] = React.useState(false);
	const createAlert = (title, message) => {
		Alert.alert(
			title,
			message,
			[
				{ text: "OK", onPress: () => console.log("OK Pressed") }
			]
		);
	}
	const backAction = async () => {
		navigate(history.prev)
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [])

	const [isSwitchOn, setIsSwitchOn] = React.useState(false);

	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	return (
		<View style={{backgroundColor: "#121313"}}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/settings') }} />
				<Appbar.Content title="Server Settings" titleStyle={{color: 'white'}} />
			</Appbar.Header>
			<TextInput
				label="Server URL"
				mode="flat"
				defaultValue={formIP}
				keyboardType="url"
				style={{margin: 10}}
				activeUnderlineColor='#9a5373'
				value={formIP}
				onChangeText={text => setFormIP(text)}
			/>
			<TextInput
				label="Port"
				mode="flat"
				defaultValue={formPort}
				value={formPort}
				keyboardType="numeric"
				style={{margin: 10}}
				activeUnderlineColor='#9a5373'
				onChangeText={text => setFormPort(text)}
			/>
			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
				<Text style={{color: 'white'}}>Use HTTPS</Text>
				<Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#9a5373' />
			</View>

			<Button
				mode="contained"
				style={{margin: 10, backgroundColor: "#9a5373"}}
				theme={{
					roundness: 1,
				}}
				onPress={() => {
					if (isIpDomain(formIP) && isPort(formPort) || formIP === "localhost") {
						console.log("IP: " + formIP + " Port: " + formPort);
					} else {
						createAlert("Error", "Invalid IP or Port");
					}
				}}>
				Save
			</Button>
		</View>
	);
}
