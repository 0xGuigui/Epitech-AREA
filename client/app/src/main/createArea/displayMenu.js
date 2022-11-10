import {Text, View, StyleSheet, BackHandler} from "react-native";
import {Pressable} from "@react-native-material/core";
import {useNavigate} from "react-router-native";
import {useContext, useEffect} from "react";
import {HistoryContext} from "../../historyContext";

export default function DisplayMenu() {
	const navigate = useNavigate()
	const history = useContext(HistoryContext)

	const backAction = () => {
		navigate(history.prev)
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
						<Text style={styles.actionsText}>Choose an action</Text>
					</Pressable>
					<Pressable style={styles.actionsPressable} onPress={() => {
						navigate('/create/reaction')
					}}>
						<Text style={styles.actionsText}>Choose a reaction</Text>
					</Pressable>
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
	}
})