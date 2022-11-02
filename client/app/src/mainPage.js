import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {useEffect} from "react";

export default function mainPage({userInfo}) {
	const navigate = useNavigate()

	const backAction = async () => {
		navigate('/login')
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [])

	return (
		<View style={styles.mainSection}>
			<Text style={styles.text}>Hello</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	mainSection: {
		width: '100%',
		height: '100%',
	},
	text: {
		bottom: 0,
		top: 0,
		left: 0,
		right: 0,
		fontSize: 50,
		color: '#14e8c2'
	}
});
