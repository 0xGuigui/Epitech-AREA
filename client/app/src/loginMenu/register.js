import {useEffect, useState} from "react";
import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {logUser, registerUser} from "../services/server";
import {Button, IconButton, TextInput} from "react-native-paper";
import {isEmail} from '../utils'

export default function Register() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirm: ""
	})
	const [error, setError] = useState({
		username: false,
		email: false,
		password: false
	})
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
				<Text style={styles.registerText}>Register your account</Text>
				<TextInput
					mode="flat"
					color='#9a5373'
					error={error.username}
					autoCapitalize='none'
					label='Enter your username'
					onPressIn={() => error.username && setError({...error, username: false})}
					onChangeText={e => setForm({...form, username: e})}
					style={{...styles.input, marginTop: 50}}
					placeholder="username"
				/>
				{error.username &&
					<Text style={styles.errorText}>Empty username</Text>
				}
				<TextInput
					mode="flat"
					color='#9a5373'
					error={error.email}
					keyboardType='email-address'
					autoCapitalize='none'
					label='Enter your email'
					onPressIn={() => error.email && setError({...error, email: false})}
					onChangeText={e => setForm({...form, email: e})}
					style={styles.input}
					placeholder="example@example.com"
				/>
				{error.email &&
					<Text style={styles.errorText}>Invalid email</Text>
				}
				<TextInput
					mode="flat"
					color='#9a5373'
					autoCapitalize='none'
					error={error.password}
					label='Enter your password'
					onPressIn={() => error.password && setError({...error, password: false})}
					onChangeText={e => setForm({...form, password: e})}
					style={styles.input}
					placeholder="*********"
					secureTextEntry
				/>
				<TextInput
					mode="flat"
					color='#9a5373'
					autoCapitalize='none'
					error={error.password}
					label='Confirm your password'
					onPressIn={() => error.password && setError({...error, password: false})}
					onChangeText={e => setForm({...form, confirm: e})}
					style={styles.input}
					placeholder="*********"
					secureTextEntry
				/>
				{error.password &&
					<Text style={styles.errorText}>Passwords mismatch or are empty</Text>
				}
				<Button
					mode="contained"
					style={styles.button}
					buttonColor="#9a5373"
					theme={{
						roundness: 1,
					}}
					onPress={async () => {
						const newError = {...error}
						if (form.username === '')
							newError.username = true
						if (!isEmail(form.email))
							newError.email = true
						if ((form.password !== form.confirm) || form.password === "" || form.confirm === "")
							newError.password = true
						if (newError.email || newError.password)
							return setError(newError)
						const response = await registerUser(form)
						if (response.status !== 200)
							return alert(response.message)
						alert('An email has been sent for verification')
						navigate('/login')
					}}>
					REGISTER
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