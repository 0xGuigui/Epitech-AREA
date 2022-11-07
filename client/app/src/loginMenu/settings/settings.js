import {Button, TextInput, Text, Switch} from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { Alert, BackHandler, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useEffect, useState } from "react";
import * as React from "react";
import { isIpDomain, isPort } from "../../utils";
import { HistoryContext } from "../../historyContext";
import { DarkTheme } from "../../../config";

export default function Settings() {
	const global = require('../../../config')
	const parsedIP = global.serverUrl.split(':')[1].split('//')[1]
	const parsedPort = global.serverUrl.split(':')[2]
	const { history } = React.useContext(HistoryContext);
	const [formIP, setFormIP] = useState(parsedIP)
	const [formPort, setFormPort] = useState(parsedPort)
	const navigate = useNavigate();
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
				<Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/login') }} />
				<Appbar.Content title="Server Settings" titleStyle={{color: 'white'}} />
			</Appbar.Header>
			<TextInput
				label="Server URL"
				mode="flat"
				defaultValue={formIP}
				keyboardType="url"
				autoCapitalize='none'
				style={{margin: 10}}
				activeUnderlineColor='#9a5373'
				value={formIP}
				onChangeText={text => setFormIP(text)}
			/>
			<TextInput
				label="Port"
				mode="flat"
				defaultValue={parsedPort}
				value={parsedPort}
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
						fetch(`http${isSwitchOn ? 's' : ''}://${formIP}:${formPort}/about.json`)
							.then(res => {
								if (res.status === 200) {
									global.serverUrl = (isSwitchOn ? "https://" : "http://") + formIP + ":" + formPort;
									console.log(global.serverUrl);
									navigate('/login')
									createAlert("Success", "Server settings saved");
								} else {
									createAlert("Error", "Server not found");
								}
							})
							.catch(() => {
								createAlert("Error", "Server not found");
							}
						);
					} else {
						createAlert("Error", "Invalid IP or port");
					}

				}}>
				Save
			</Button>
		</View>
	);
}
