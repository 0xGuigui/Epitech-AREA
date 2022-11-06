import * as React from 'react';
import { Appbar, MD3DarkTheme, MD3LightTheme, Divider } from 'react-native-paper';
import {ScrollView, Text, useColorScheme, View, StyleSheet, BackHandler, Animated, Platform} from "react-native";
import { useNavigate } from "react-router-native";
import {useEffect, useState} from "react";

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export default function Settings() {
	let theme = useColorScheme() === 'dark' ? MD3DarkTheme : MD3LightTheme;
	const navigate = useNavigate();
	const { colors } = theme;
	const backAction = async () => {
		navigate('/login')
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [])

	return (
		<View style={{ backgroundColor: colors.background }}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Action icon="menu" color={'white'} onPress={() => {}} />
				<Appbar.Content title="Settings" titleStyle={{color: 'white'}} />
			</Appbar.Header>
			<ScrollView>
				{/*<Button*/}
				{/*	mode="text"*/}
				{/*	buttonColor="#303038"*/}
				{/*	theme={{*/}
				{/*		roundness: 0,*/}
				{/*	}}*/}
				{/*	textColor='#FFFFFF'*/}
				{/*	onPress={() => console.log('Pressed')}>*/}
				{/*</Button>*/}
				<Divider/>
				<Text
					style={styles.clickableText} onPress={() => console.log("Coucou")}>
					Platform
				</Text>
				<Divider/>
				<Text
					style={styles.clickableText} onPress={() => console.log("Coucou")}>
					Configure server
				</Text>
				<Divider/>
				<Text
					style={styles.clickableText} onPress={() => console.log("Coucou")}>
					Keep me logged in
				</Text>
				<Divider/>
				<Text
					style={styles.clickableText} onPress={() => console.log("Coucou")}>
					Reset Password
				</Text>
				<Divider/>
				<Text style={styles.endOfScroll}>
				</Text>
			</ScrollView>

		</View>
	);
};

const DarkTheme = {
	...MD3LightTheme,
	dark: true,

	colors: {
		...MD3LightTheme.colors,
		primary: '#9a5373',
		accent: '#f1c40f',
		background: '#2c3e50',
		surface: '#303038',
		text: '#ecf0f1',
		textColor: '#ecf0f1',
		disabled: '#ecf0f1',
		placeholder: '#ecf0f1',
		backdrop: '#34495e',
		notification: '#f1c40f',
	},
};

const styles = StyleSheet.create({
	clickableText: {
		textAlign: 'left',
		fontSize: 14,
		margin: 0,
		padding: 20,
		backgroundColor: "#303038",
		color: 'white'
	},
	scrollBackgroundColor: {
		backgroundColor: "#303038",
	},
	endOfScroll: {
		padding: Platform.OS === 'ios' ? 100 : 50,
		color: "#303038",
		backgroundColor: "#303038",
	}
});
