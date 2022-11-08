import {useContext, useEffect, useState} from "react";
import {BackHandler, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useNavigate} from "react-router-native";
import {registerUser} from "../services/server";
import {Appbar, Button, TextInput} from "react-native-paper";
import {isEmail} from '../utils'
import {HistoryContext} from "../historyContext";
import {DarkTheme} from "../../config";
import * as React from "react";

export default function Register() {
	const history = useContext(HistoryContext)
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
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/login') }} />
				<Appbar.Content title="Register Account" titleStyle={{color: 'white'}} />
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
	errorText: {
		color: '#d51c1c',
		textAlign: 'center',
		marginTop: 2
	}
});
