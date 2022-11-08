import {StyleSheet, Text, View, Linking} from "react-native";
import {Pressable} from "@react-native-material/core";
import {useState} from "react";
import {Appbar} from "react-native-paper";
import {DarkTheme} from "../../../config";
import * as React from "react";
import * as WebBrowser from 'expo-web-browser'

export default function CreateArea() {

	return (
		<View style={styles.mainSection}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Content title="Create a new action" titleStyle={{color: 'white'}}/>
			</Appbar.Header>
			<View style={styles.actionsContainer}>
				<View style={styles.actions}>
					<Pressable style={styles.actionsPressable} onPress={() => {
						const clientId = "1022518270202499072"
						const redirect_uri = "area://oauth2"
						const scopes = "identify email guilds guilds.members.read connections"
						WebBrowser.openBrowserAsync(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=${scopes}`)
					}}>
						<Text style={styles.actionsText}>Choose an action</Text>
					</Pressable>
					<Pressable style={styles.actionsPressable} onPress={() => {

					}}>
						<Text style={styles.actionsText}>Choose a reaction</Text>
					</Pressable>
				</View>
			</View>
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
	},
	actionsContainer: {
		position: 'absolute',
		height: '100%',
		width: '100%'
	},
	actions: {
		width: '100%',
		marginTop: 'auto',
		marginBottom: 'auto',
		marginRight: 'auto',
		marginLeft: 'auto',
		justifyContent: 'center',
		alignItems: 'center'
	},
	actionsPressable: {
		width: '90%',
		height: '30%',
		borderWidth: 2,
		borderRadius: 20,
		borderColor: 'white',
		marginTop: '3%',
	},
	actionsText: {
		color: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto',
		fontSize: 30
	}

});
