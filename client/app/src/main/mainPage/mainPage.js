import {BackHandler, StyleSheet, Text, View} from "react-native";
import {useNavigate} from "react-router-native";
import {useContext, useEffect, useState} from "react";
import {HistoryContext} from "../../historyContext";
import {getActions, getMe, refreshToken} from "../../services/server";
import {Pressable} from "@react-native-material/core";
import ActionDisplay from "./actionDisplay";
import ActionModal from "./ActionModal";
import {DarkTheme} from "../../../config";
import {Appbar} from "react-native-paper";
import * as React from "react";

export default function mainPage({userInfo}) {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)
	const [actions, setActions] = useState([])
	const [actionModal, setActionModal] = useState(undefined)

	const backAction = async () => {
		navigate(history.prev)
	}

	const getUserActions = async () => {
		const token = await refreshToken()
		token.status !== 200 && navigate('/login')
		const actions = await getActions(token.token)
		actions.status !== 200 && navigate('/login')
		setActions([...actions.actions, ...actions.actions, ...actions.actions])
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
			<Appbar.Header theme={DarkTheme}>
				<Appbar.Content title="My Actions" titleStyle={{color: 'white'}}/>
			</Appbar.Header>
			<Text style={styles.titleText}> Welcome {userInfo?.user?.username}</Text>
			{actions.length > 0 ?
				<View key='actionKey' style={styles.actionsContainer}>
					{actions.map((e, i) =>
						<>
							<ActionDisplay key={i} action={e} style={styles.actions} textStyle={styles.actionsText} onPress={() => {
								setActionModal(e)
							}} />
						</>
					)}
					{actions.length % 2 === 1 && <View style={{...styles.actions, borderWidth: 0}}/>}
				</View>
				:
				<View style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 'auto', marginTop: '70%'}}>
					<Text style={{color: 'white', fontSize: 20, marginLeft: 'auto', marginRight: 'auto'}}>No actions found</Text>
					<Pressable onPress={() => navigate('/create')}>
						<Text style={{color: '#107dc7', fontSize: 20, marginLeft: 'auto', marginRight: 'auto', textDecorationLine: 'underline'}}>Create one</Text>
					</Pressable>
				</View>
			}
			{actionModal &&
				<ActionModal action={actionModal} setAction={setActionModal}/>
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
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	actions: {
		width: '45%',
		height: '20%',
		borderWidth: 2,
		borderRadius: 20,
		borderColor: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '3%'
	},
	actionsText: {
		color: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	titleText: {
		fontSize: 30,
		fontWeight: 'bold',
		paddingLeft: '3%',
		paddingTop: '3%',
		color: 'white'
	}
});
