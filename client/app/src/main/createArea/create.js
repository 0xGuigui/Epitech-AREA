import {StyleSheet, Text, View, Linking} from "react-native";
import {Pressable} from "@react-native-material/core";
import {useState} from "react";
import {Appbar} from "react-native-paper";
import {DarkTheme} from "../../../config";
import * as React from "react";
import * as WebBrowser from 'expo-web-browser'
import {generateCodeVerifier} from "../../utils";

export default function CreateArea() {

	return (
		<View style={styles.mainSection}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Content title="Create a new action" titleStyle={{color: 'white'}}/>
			</Appbar.Header>
			<View style={styles.actionsContainer}>
				<View style={styles.actions}>
					<Pressable style={styles.actionsPressable} onPress={() => {
						const clientId = "e62780e3630e4439b855928a8514e977"
						const redirect_uri = "http://92.148.23.72:8080/oauth2/Spotify"
						const scopes = "user-read-private user-read-email user-read-playback-state user-modify-playback-state app-remote-control playlist-read-private"
						WebBrowser.openBrowserAsync(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirect_uri}`)
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
