import {StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";
import {useState} from "react";

export default function CreateArea() {
	const [area, setArea] = useState({
		action: {},
		reaction: {}
	})

	return (
		<View style={styles.mainSection}>
			<Text style={styles.text}>Create an action</Text>
			<View style={styles.actionsContainer}>
				<Pressable style={styles.actions} onPress={() => {

				}}>
					<Text style={styles.actionsText}>Create action</Text>
				</Pressable>
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
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	actions: {
		width: '45%',
		height: '20%',
		borderWidth: 2,
		borderRadius: 20,
		borderColor: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '3%'
	},
	actionsText: {
		color: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto'
	}

});
