import {Alert, StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";
import {deleteAction, refreshToken} from "../../services/server";
import {Modal} from "react-native-paper";
import {useContext, useState} from "react";
import {AreaContext} from "./areaContext";
import {useNavigate} from "react-router-native";

export default function ({action, setAction, serviceName, serviceType}) {
	const {area, setArea} = useContext(AreaContext)
	const [data, setData] = useState({})
	const navigate = useNavigate()

	return (
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
				<Pressable style={styles.saveButton} onPress={async () => {
					// Object.keys(action.fields).forEach(e => {
					// 	if (!data[e])
					//		TODO error management if data not filled
					// })
					setArea({
						...area,
						[serviceType]: {
							name: action.name,
							serviceName,
							data
						}
					})
					setAction(undefined)
					navigate('/create')
				}}>
					<Text style={styles.saveButtonText}>Save</Text>
				</Pressable>
				<Pressable style={styles.cancelButton} onPress={() => setAction(undefined)}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</Pressable>
			</View>
		</Modal>
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
	saveButton: {
		position: 'absolute',
		bottom: '10%',
		right: '8%'
	},
	saveButtonText: {
		color: '#0a9307',
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
