import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {useContext, useEffect, useState} from "react";
import {HistoryContext} from "../../historyContext";
import {getActions, getMe, refreshToken} from "../../services/server";
import {Pressable} from "@react-native-material/core";

export default function mainPage({userInfo}) {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)
	const [actions, setActions] = useState([])

	const backAction = async () => {
		navigate(history.prev)
	}

	const getUserActions = async () => {
		const token = await refreshToken()
		token.status !== 200 && navigate('/login')
		const actions = await getActions(token.token)
		actions.status !== 200 && navigate('/login')
	}

	useEffect(() => {
		getUserActions()
	}, [])

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<View style={styles.mainSection}>
			<Text style={styles.text}>My Actions</Text>
			{actions.length > 0 ?
				<View style={styles.actionsContainer}>
					{actions.map(e => {

					})}
				</View>
				:
				<View style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 'auto', marginTop: '70%'}}>
					<Text style={{color: 'white', fontSize: 20, marginLeft: 'auto', marginRight: 'auto'}}>No actions found</Text>
					<Pressable onPress={() => navigate('/create')}>
						<Text style={{color: '#107dc7', fontSize: 20, marginLeft: 'auto', marginRight: 'auto', textDecorationLine: 'underline'}}>Create one</Text>
					</Pressable>
				</View>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	mainSection: {
		width: '100%',
		height: '100%',
	},
	text: {
		fontSize: 40,
		marginTop: '10%',
		marginBottom: '10%',
		marginRight: 'auto',
		marginLeft: '3%',
		color: '#FFFFFF'
	},
	actionsContainer: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%'
	}
});
