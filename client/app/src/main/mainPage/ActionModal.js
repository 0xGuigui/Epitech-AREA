import {Modal} from "react-native-paper";
import {Image, StyleSheet, Text, View} from "react-native";
import {Button, Pressable} from "@react-native-material/core";
import {useParams} from "react-router-native";

export default function ActionModal({action, setAction}) {
	const params = useParams()
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
					<Text style={styles.textStyle}> Do you want to remove this action ?</Text>
					<Pressable style={styles.deleteButton}>
						<Text style={styles.deleteButtonText}>Delete</Text>
					</Pressable>
					<Pressable style={styles.cancelButton} onPress={() => setAction(undefined)}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
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
		height: '20%',
		marginTop: '80%',
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
	textStyle: {
		color: 'white',
		fontSize: 20,
		marginTop: '10%',
		marginBottom: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto'
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
		bottom: '10%',
		right: '8%'
	},
	deleteButtonText: {
		color: '#c21f1f',
		fontSize: 15
	},
	cancelButton: {
		position: 'absolute',
		bottom: '10%',
		right: '30%'
	},
	cancelButtonText: {
		color: '#FFFFFF',
		fontSize: 15
	}
})
