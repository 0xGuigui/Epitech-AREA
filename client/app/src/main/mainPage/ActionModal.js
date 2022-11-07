import {Modal} from "react-native-paper";
import {StyleSheet, Text, View} from "react-native";
import {Button, Pressable} from "@react-native-material/core";

export default function ActionModal({action, setAction}) {
	console.log(action)
	return (
		<>
			<Modal
				visible={true}
				onDismiss={() => setAction(undefined)}
				style={styles.modal}
				theme={{
					colors: {
						backdrop: 'rgba(7,6,6,0.45)',
					},
				}}
			>
				<View style={styles.modalContainer}>
					<Text style={styles.actionTitle}>{action.name}</Text>
					{/*<Pressable style={styles.saveButton}>*/}
					{/*	<Text style={styles.saveButtonText}>Save</Text>*/}
					{/*</Pressable>*/}
					<Pressable style={styles.deleteButton}>
						<Text style={styles.deleteButtonText}>Delete</Text>
					</Pressable>
				</View>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	modal: {
		backgroundColor: '#212123',
		width: '75%',
		height: '50%',
		marginTop: '40%',
		marginBottom: 'auto',
		marginLeft: '12.5%',
		marginRight: 'auto',
		borderRadius: 20,
	},
	modalContainer: {
		height: '100%',
		width: '100%',
		position: 'relative'
	},
	actionTitle: {
		textAlign: 'center',
		fontSize: 20,
		color: 'white',
		marginTop: '5%'
	},
	// saveButton: {
	// 	position: 'absolute',
	// 	bottom: '5%',
	// 	left: '8%'
	// },
	// saveButtonText: {
	// 	color: '#FFFFFF',
	// 	fontSize: 15
	// },
	deleteButton: {
		position: 'absolute',
		bottom: '5%',
		right: '8%'
	},
	deleteButtonText: {
		color: '#c21f1f',
		fontSize: 15
	}
})