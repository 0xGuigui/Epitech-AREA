import { useContext, useState } from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {useNavigate, useParams} from "react-router-native";
import {updateUser, refreshToken} from "../../services/server";
import { Appbar, Button, TextInput } from "react-native-paper";
import {isEmail, showToast} from '../../utils'
import { HistoryContext } from "../../historyContext";
import { DarkTheme } from "../../../config";
import * as React from "react";

export default function ChangeUserData({userInfo, setUserInfo}) {
	const navigate = useNavigate()
	const {data} = useParams()
	const history = useContext(HistoryContext)
	const [userData, setUserData] = useState('')
	const [previousData, setPreviousData] = useState('')

	return (
		<View style={DarkTheme.container}>
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate(history.prev) }} />
				<Appbar.Content title={`Change ${data}`} titleStyle={{color: 'white'}} />
			</Appbar.Header>
			<View style={DarkTheme.subView}>
				<View style={DarkTheme.subsubView}>
					<Text style={{...styles.accountText}}>Change your {data}</Text>
					{data === 'password' &&
						<>
							<TextInput
								mode="flat"
								activeUnderlineColor='#9a5373'
								label={`Enter your current ${data}`}
								style={styles.input}
								placeholder={`Current ${data}`}
								onChangeText={(e) => setPreviousData(e)}
							/>
						</>
					}
					<TextInput
						mode="flat"
						activeUnderlineColor='#9a5373'
						label={`Enter your new ${data}`}
						style={styles.input}
						placeholder={`New ${data}`}
						onChangeText={(e) => setUserData(e)}
					/>
					<Button
						mode="contained"
						style={styles.button}
						buttonColor="#9a5373"
						theme={{
							roundness: 1,
							colors: {
								primary: '#9a5373',
							},
						}}
						onPress={ async () => {
							if (data === 'email' && !isEmail(userData) || data === 'password' && userData.length < 8 || data === 'username' && userData.length < 3 || data === 'username' && userData.length > 20) {
								showToast(`Invalid ${data}`)
								return
							}
							Alert.alert(
								`Change ${data}`,
								`Are you sure you want to change your ${data}`,
								[
									{
										text: "Cancel",
										onPress: () => {},
										style: "cancel"
									},
									{ text: "OK", onPress: async () => {
											const token = await refreshToken()
											if (token.status === 200) {
												const res = await updateUser(token.token, data, userData, previousData)
												if (res.status === 200) {
													setUserInfo({...userInfo, [data]: res.user[data]})
													showToast(`${data} changed`)
													return navigate(history.prev)
												}
											}
											showToast(`Failed to change ${data}`)
										}
									}
								],
								{ cancelable: false }
							);
						}}
					>
						Change {data}
					</Button>
				</View>
			</View>
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
	accountText: {
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
