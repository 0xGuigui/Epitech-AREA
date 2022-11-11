import {Text, View, StyleSheet, BackHandler} from "react-native";
import {Pressable} from "@react-native-material/core";
import {useNavigate} from "react-router-native";
import {useContext, useEffect} from "react";
import {HistoryContext} from "../../historyContext";
import {AreaContext} from "./areaContext";
import {Button} from "react-native-paper";
import {refreshToken, registerArea} from "../../services/server";

export default function DisplayMenu() {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)
	const {area} = useContext(AreaContext)

	console.log(area)

	const backAction = () => {
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<>
			<View style={styles.actionsContainer}>
				<View style={styles.actions}>
					<Pressable style={styles.actionsPressable} onPress={() => {
						navigate('/create/action')
					}}>
						<Text style={styles.actionsText}>{area.action.name || 'Choose an action'}</Text>
					</Pressable>
					<Pressable style={styles.actionsPressable} onPress={() => {
						navigate('/create/reaction')
					}}>
						<Text style={styles.actionsText}>{area.reaction.name || 'Choose a reaction'}</Text>
					</Pressable>
					{area.action.name && area.reaction.name &&
						<Button
							mode="contained"
							style={styles.createButton}
							buttonColor="#9a5373"
							theme={{
								roundness: 1,
							}}
							onPress={async () => {
								if (area.name === '')
									delete area.name
								const token = await refreshToken()
								token.status !== 200 && navigate('/login')
								const res = registerArea(token.token, area)
								console.log(res)
							}}>
							REGISTER AREA
						</Button>
					}
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	actionsContainer: {
		position: 'absolute',
		height: '100%',
		width: '100%'
	},
	actions: {
		width: '100%',
		marginTop: 'auto',
		marginBottom: 'auto',
		marginRight: 'auto',
		marginLeft: 'auto',
		justifyContent: 'center',
		alignItems: 'center'
	},
	actionsPressable: {
		width: '90%',
		height: '30%',
		borderWidth: 2,
		borderRadius: 20,
		borderColor: 'white',
		marginTop: '3%',
	},
	actionsText: {
		color: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto',
		fontSize: 30
	},
	createButton: {
		marginTop: '3%'
	}
})
