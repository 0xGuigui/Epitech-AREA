import { useContext, useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { useNavigate } from "react-router-native";
import { resetPassword } from "../services/server";
import { Appbar, Button, TextInput } from "react-native-paper";
import { isEmail } from '../utils'
import { HistoryContext } from "../historyContext";
import { DarkTheme } from "../../config";
import * as React from "react";

export default function Forgot() {
	const [form, setForm] = useState("")
	const [error, setError] = useState(false)
	const navigate = useNavigate()
	const history = useContext(HistoryContext)

	const backAction = async () => {
		navigate(history.prev)
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])


	return (
		<View style={styles.view}>
			{/*<IconButton*/}
			{/*	icon="arrow-left-thick"*/}
			{/*	iconColor="white"*/}
			{/*	size={24}*/}
			{/*	style={styles.backButton}*/}
			{/*	onPress={() => {*/}
			{/*		navigate('/login')*/}
			{/*	}} />*/}
			<View style={styles.subView}>
				<View style={styles.subsubView}>
					<Text style={styles.registerText}>Recover your password</Text>
					<TextInput
						mode="flat"
						activeUnderlineColor='#9a5373'
						error={error}
						keyboardType='email-address'
						autoCapitalize='none'
						label='Enter your email'
						onPressIn={() => error && setError(true)}
						onChangeText={e => setForm(e)}
						style={styles.input}
						placeholder="example@example.com"
					/>
					{error &&
						<Text style={styles.errorText}>Invalid email</Text>
					}
					<Button
						mode="contained"
						style={styles.button}
						buttonColor="#9a5373"
						theme={{
							roundness: 1,
						}}
						onPress={async () => {
							if (!isEmail(form))
								return setError(true)
							const response = await resetPassword(form)
							if (response.status !== 200)
								return alert(response.message)
							alert('An email has been sent to reset your password')
							navigate('/login')
						}}>
						RECOVER
					</Button>
				</View>
			</View>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/login') }} />
				<Appbar.Content title="Reset password" titleStyle={{ color: 'white' }} />
			</Appbar.Header>
		</View>
	)
}

const styles = StyleSheet.create({
	view: {
		width: '100%',
		height: '100%',
		backgroundColor: '#121313',
	},
	subView: {
		position: 'absolute',
		width: '100%',
		height: '100%'
	},
	subsubView: {
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	registerText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 30,
	},
	input: {
		marginLeft: 16,
		marginRight: 16,
		marginTop: 15,
		color: 'white',
		trailingContainerStyle: 'white'
	},
	button: {
		width: '75%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 30,
		height: 40,
		justifyContent: 'center'
	},
	backButton: {
		marginLeft: '2%',
		marginRight:'auto',
		marginTop: '12%'
	},
	errorText: {
		color: '#d51c1c',
		textAlign: 'center',
		marginTop: 2
	}
});
