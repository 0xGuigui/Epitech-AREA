import * as React from 'react';
import {Appbar, MD3DarkTheme, MD3LightTheme, withTheme, List, MD3Colors} from 'react-native-paper';
import {FlatList, ScrollView, Text, useColorScheme, View, StyleSheet, BackHandler} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import { useNavigate } from "react-router-native";
import {useEffect} from "react";

const Section = ({children, title}) => {
	const isDarkMode = useColorScheme() === 'dark';
	return (
		<View style={styles.sectionContainer}>
			<Text
				style={[
					styles.sectionTitle,
					{
						color: isDarkMode ? Colors.white : Colors.black,
					},
				]}>
				{title}
			</Text>
		</View>
	);
};


export default function Settings({userInfo}) {
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
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Back" onPress={() => {*/}
				{/*	navigate('/');*/}
				{/*}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
				{/*<Section title="Server Settings" onPress={() => {}}/>*/}
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
	sectionContainer: {
		marginTop: 25,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 14,
	},
});
