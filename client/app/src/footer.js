import {StyleSheet, View} from "react-native";

export default function AppFooter() {
	return (
		<View style={styles.footerContainer}>
		</View>
	)
}

const styles = StyleSheet.create({
	footerContainer: {
		width: '100%',
		height: '10%',
		position: 'absolute',
		backgroundColor: '#212123',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 2,
		borderTopColor: '#474749'
	}
});
