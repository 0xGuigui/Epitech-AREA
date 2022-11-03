import {useEffect, useState} from "react";
import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {logUser, registerUser, resetPassword} from "../services/server";
import {Button, IconButton, TextInput} from "react-native-paper";
import {isEmail} from '../utils'

export default function Forgot() {
	const [form, setForm] = useState("")
	const [error, setError] = useState(false)
	const navigate = useNavigate()

	const backAction = async () => {
		navigate('/login')
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [])


	return (
		<View style={styles.view}>
			<IconButton
				icon="arrow-left-bottom"
				iconColor="white"
				size={24}
				style={styles.backButton}
				onPress={() => {
					navigate('/login')
				}} />
			<View style={styles.subView}>
				<Text style={styles.registerText}>Recover your password</Text>
				<TextInput
					mode="flat"
					color='#9a5373'
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
	)
}

const styles = StyleSheet.create({
	view: {
		width: '100%',
		height: '100%',
		backgroundColor: '#212123',
	},
	subView: {
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
		marginTop: '8%'
	},
	errorText: {
		color: '#d51c1c',
		textAlign: 'center',
		marginTop: 2
	}
});