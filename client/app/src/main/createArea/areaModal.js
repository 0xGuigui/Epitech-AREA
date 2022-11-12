import {Alert, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView} from "react-native";
import { Pressable } from "@react-native-material/core";
import {deleteAction, refreshToken, registerArea} from "../../services/server";
import { Modal, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { AreaContext } from "./areaContext";
import { useNavigate } from "react-router-native";
import {showToast} from "../../utils";

export default function ({action, setAction}) {
	const {area, setArea} = useContext(AreaContext)
	const [data, setData] = useState('')
	const navigate = useNavigate()

	return (
		<Modal
			visible={action}
			onDismiss={() => setAction(false)}
			style={{...styles.modal, height: `18%`}}
			theme={{
				colors: {
					backdrop: 'rgba(7,6,6,0.45)',
				}
			}}>
			<View style={styles.modalContainer}>
				<ScrollView style={styles.scrollView}>
					<Text style={styles.actionTitle}>Save your area</Text>
					<TextInput
						label={'Area name (optional)'}
						style={{...styles.textInput, marginLeft: 20, marginRight: 20, marginTop: 20}}
						onChangeText={text => setData(text)}
					/>
					<Pressable style={styles.saveButton} onPress={async () => {
						area.name = data
						if (area.name === '')
							delete area.name
						const token = await refreshToken()
						token.status !== 200 && navigate('/login')
						const res = await registerArea(token.token, area)
						showToast('Area created')
						setArea({
							action: {},
							reaction: {}
						})
						setAction(false)
					}}>
						<Text style={styles.saveButtonText}>Save</Text>
					</Pressable>
					<Pressable style={styles.cancelButton} onPress={() => setAction(false)}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>
				</ScrollView>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modal: {
		backgroundColor: '#212123',
		width: '75%',
		height: '20%',
		marginTop: '60%',
		marginBottom: '100%',
		marginLeft: '12.5%',
		marginRight: 'auto',
		borderRadius: 20,
	},
	modalContainer: {
		height: '100%',
		width: '100%',
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
		position: 'relative',
		marginTop: '10%',
		marginBottom: 'auto',
		marginLeft: '10%',
		marginRight: 'auto',
	},
	saveButton: {
		bottom: -20,
		left: '80%',
		right: '8%',
		marginRight: 'auto',
	},
	saveButtonText: {
		color: '#0a9307',
		fontSize: 15
	},
	cancelButton: {
		bottom: 0,
		left: '58%',
		right: '30%',
		marginTop: 'auto',
		marginBottom: '10%',
		marginRight: 'auto',
	},
	cancelButtonText: {
		color: '#FFFFFF',
		fontSize: 15
	}
})
