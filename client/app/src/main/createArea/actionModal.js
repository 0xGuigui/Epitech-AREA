import {Alert, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView} from "react-native";
import { Pressable } from "@react-native-material/core";
import { deleteAction, refreshToken } from "../../services/server";
import { Modal, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { AreaContext } from "./areaContext";
import { useNavigate } from "react-router-native";
import {showToast} from "../../utils";

export default function ({action, setAction, serviceName, serviceType}) {
	const {area, setArea} = useContext(AreaContext)
	const [data, setData] = useState({})
	const navigate = useNavigate()
	const numberOfFields = Object.keys(action.fields).length

	console.log(action)
	console.log('keys:', Object.keys(action))
	console.log('values:', Object.values(action))

	return (
		<Modal
			visible={true}
			onDismiss={() => setAction(undefined)}
			style={{...styles.modal, height: `${20 + numberOfFields * 10}%`}}
			theme={{
				colors: {
					backdrop: 'rgba(7,6,6,0.45)',
				}
			}}>
			<View style={styles.modalContainer}>
				<ScrollView style={styles.scrollView}>
					<Text style={styles.actionTitle}>{action.name}</Text>
					<Text style={styles.textStyle}> Do you want to add this action to your area ?</Text>
					{numberOfFields > 0 && <Text style={styles.textStyle}>Please fill the fields below:</Text>}
					{Object.keys(action.fields).map((field, index) => {
						return (
							<TextInput
								key={index}
								label={field}
								style={{...styles.textInput, marginTop: index === 0 ? 20 : 0, marginLeft: 20, marginRight: 20}}
								onChangeText={text => setData({...data, [field]: text})}
							/>
						)
					})}
					{Object.keys(action.fields).map((field, index) => {
						return (
							<TextInput
								key={index}
								label={field}
								style={{...styles.textInput, marginTop: index === 0 ? 20 : 0, marginLeft: 20, marginRight: 20}}
								onChangeText={text => setData({...data, [field]: text})}
							/>
						)
					})}
					{Object.keys(action.fields).map((field, index) => {
						return (
							<TextInput
								key={index}
								label={field}
								style={{...styles.textInput, marginTop: index === 0 ? 20 : 0, marginLeft: 20, marginRight: 20}}
								onChangeText={text => setData({...data, [field]: text})}
							/>
						)
					})}
					<Pressable style={styles.saveButton} onPress={async () => {
						Object.keys(action.fields).forEach(e => {
							if (!data[e]) {
								Alert.alert(
									"Error",
									"Please fill all the fields",
									[
										{
											text: "OK",
											onPress: () => {

											},
										},

									],
									{cancelable: false}
								);
							} else {
								setArea({
									...area,
									actions: [
										...area.actions,
										{
											name: action.name,
											serviceName: serviceName,
											serviceType: serviceType,
											data: data
										}
									]
								})
								showToast('Action added to your area')
								setAction(undefined)
							}
						})
					}}>
						<Text style={styles.saveButtonText}>Save</Text>
					</Pressable>
					<Pressable style={styles.cancelButton} onPress={() => setAction(undefined)}>
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
		flex: 1,
		bottom: -20,
		left: '80%',
		right: '8%'
	},
	saveButtonText: {
		color: '#0a9307',
		fontSize: 15
	},
	cancelButton: {
		flex: 1,
		bottom: 0,
		left: '58%',
		right: '30%',
		marginTop: 'auto',
		marginBottom: '10%'
	},
	cancelButtonText: {
		color: '#FFFFFF',
		fontSize: 15
	}
})
