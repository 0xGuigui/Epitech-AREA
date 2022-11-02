import {StyleSheet, Text, View} from "react-native";

export default function mainPage() {
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
		fontSize: 500,
		color: 'white'
	}
});
