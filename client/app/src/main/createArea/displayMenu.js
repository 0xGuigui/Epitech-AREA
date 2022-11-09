import {Text, View, StyleSheet} from "react-native";
import {Pressable} from "@react-native-material/core";

export default function DisplayMenu() {
	return (
		<>
			<View style={styles.actionsContainer}>
				<View style={styles.actions}>
					<Pressable style={styles.actionsPressable} onPress={() => {

					}}>
						<Text style={styles.actionsText}>Choose an action</Text>
					</Pressable>
					<Pressable style={styles.actionsPressable} onPress={() => {

					}}>
						<Text style={styles.actionsText}>Choose a reaction</Text>
					</Pressable>
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
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
})
