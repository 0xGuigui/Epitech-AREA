import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {useContext, useEffect} from "react";
import {HistoryContext} from "./historyContext";

export default function mainPage({userInfo}) {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)

	const backAction = async () => {
		navigate(history.prev)
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

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
