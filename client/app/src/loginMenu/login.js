import { View, Text, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import {useNavigate} from "react-router-native";
import { Pressable } from "@react-native-material/core";
import {Button, TextInput, IconButton} from 'react-native-paper';
import {getMe, logUser} from "../services/server";
import logo from '../assets/logo/logo.png'
import global from '../../config'
import discordLogo from '../assets/icons/discord-mark-white.png'

export default function Login({ setUserInfo }) {
	const [form, setForm] = useState({
		email: "",
		password: ""
	})
	const navigate = useNavigate()

	return (
		<View style={styles.loginSection}>
			<View>
				<IconButton
					icon="server-network"
					iconColor="white"
					size={24}
					style={styles.settingsButton}
					onPress={() => {
						navigate('/settings')
					}} />
				<Image source={logo} style={styles.logo}/>
				<Text style={styles.loginWelcome}>AREA Project</Text>
				<TextInput
					mode="flat"
					color='#9a5373'
					label="Email"
					autoCapitalize='none'
					keyboardType='email-address'
					activeUnderlineColor='#9a5373'
					onChangeText={e => setForm({...form, email: e})}
					style={{ marginLeft: 16, marginRight: 16, marginTop: 16, color: 'white', trailingContainerStyle: 'white'}}
					placeholder="example@example.com"
				/>
				<TextInput
					mode="flat"
					color='#9a5373'
					label="Password"
					autoCapitalize='none'
					activeUnderlineColor='#9a5373'
					onChangeText={e => setForm({...form, password: e})}
					style={{ marginLeft: 16, marginRight: 16, marginTop: 10, color: '#121313'}}
					placeholder="*********"
					secureTextEntry
				/>
				<Pressable style={styles.forgotSection} onPress={() => {
					navigate('/forgot')
				}}>
					<Text style={styles.forgot}>forgot password ?</Text>
				</Pressable>
				<Button
					mode="contained"
					style={styles.button}
					buttonColor="#9a5373"
					theme={{
						roundness: 1,
					}}
					onPress={async () => {
						const log = await logUser(form)
						if (log.status !== 200)
							return alert(log.message)
						const me = await getMe(log.token)
						setUserInfo(me.user)
						navigate('/')
					}}>
					CONNECT
				</Button>
				<Button
					mode="contained"
					style={styles.button}
					buttonColor="#9a5373"
					theme={{
						roundness: 1,
					}}
					onPress={() => {
						navigate('/register')
					}}>
					REGISTER
				</Button>
				<Button
					mode="contained"
					icon={discordLogo}
					theme={{
						roundness: 1,
					}}
					onPress={() => {}}
					buttonColor="#5865F2"
					style={styles.button}
				>
					Sign in with Discord
				</Button>
			</View>
			<Text style={{...styles.forgotSection, color: 'white', paddingTop: 20, textAlign: 'center' }}> Actually connected to: {global.serverUrl} </Text>
		</View>

	);
}

const styles = StyleSheet.create({
	logo: {
		top: 50,
		width: 150,
		height: 150,
		marginLeft: 'auto',
		marginRight: 'auto'

	},
	loginSection: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: '100%',
		height: '100%',
	},
	loginWelcome: {
		fontSize: 40,
		fontWeight: '600',
		textAlign: 'center',
		color: 'white',
		marginTop: 60,
	},
	forgotSection: {
		marginTop: 10,
		height: 40,
		justifyContent: 'center'
	},
	forgot: {
		textAlign: 'center',
		fontSize: 15,
		color: 'grey'
	},
	button: {
		width: '75%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '4%'
	},
	settingsButton: {
		marginRight: '2%',
		marginLeft:'auto',
		marginTop: '12%',
	}
});
