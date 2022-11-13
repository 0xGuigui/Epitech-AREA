import { Modal } from "react-native-paper";
import {Alert, StyleSheet, Text, View} from "react-native";
import { Pressable } from "@react-native-material/core";
import {useNavigate} from "react-router-native";
import { deleteAction, refreshToken } from "../../services/server";
import {showToast} from "../../utils";

export default function ActionModal({action, setAction}) {
	const navigate = useNavigate()

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
					<Pressable style={styles.deleteButton} onPress={async () => {
						Alert.alert(
							"Delete Action",
							"Are you sure you want to delete this action ?",
							[
								{
									text: "Cancel",
								},
								{
									text: "OK",
									onPress: async () => {
										const token = await refreshToken()
										token.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
										const res = await deleteAction(token.token, action._id)
										res.status !== 200
											? alert('Error while deleting action')
											: setAction(undefined)
										navigate(`/`)
									}
								}
							],
							{ cancelable: false }
						);
					}}>
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
