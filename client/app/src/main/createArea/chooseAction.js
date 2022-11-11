import {useNavigate, useParams} from "react-router-native";
import {
	checkService,
	getAbout,
	getActionByName,
	getReactionByName,
	getServices,
	refreshToken
} from "../../services/server";
import {useContext, useEffect, useState} from "react";
import {Oauth2} from "../../../config";
import * as WebBrowser from "expo-web-browser";
import {BackHandler, StyleSheet, View} from "react-native";
import DataDisplayer from "../../dataDisplayer";
import {Text} from "react-native-paper";
import ActionModal from "./actionModal";
import {HistoryContext} from "../../historyContext";

export default function ChooseAction() {
	const {serviceType, serviceName} = useParams()
	const [actions, setActions] = useState([])
	const navigate = useNavigate()
	const [actionModal, setActionModal] = useState(undefined)
	const history = useContext(HistoryContext)

	const getServerActions = async () => {
		const token = await refreshToken()
		token.status !== 200 && navigate('/login')
		const about = await getServices(token.token)
		about.status !== 200 && navigate('/login')
		const serviceActions = about.services.find(e => e.name === serviceName)[serviceType === "action" ? "actions" : "reactions"]
		const actionsData = await Promise.all(serviceActions.map(async e => {
			const action = await (serviceType === 'action' ? getActionByName(token.token, serviceName, e) : getReactionByName(token.token, serviceName, e))
			return action[serviceType]
		}))
		setActions(actionsData)
	}

	useEffect(() => {
		getServerActions()
	}, [])

	const backAction = () => {
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<>
			<Text style={{fontSize: 40, color: 'white', textAlign: 'center'}}>Choose a{serviceType === 'action' && 'n'} {serviceType}</Text>
			<View key='actionKey' style={styles.actionsContainer}>
				{actions.map((e, i) =>
					<>
						<DataDisplayer keyProp={i} text={e.name} style={styles.actions} textStyle={styles.actionsText} onPress={async () => {
							setActionModal(e)
						}} />
					</>
				)}
				{actions.length % 2 === 1 && <View style={{...styles.actions, borderWidth: 0}}/>}
			</View>
			{actionModal && <ActionModal action={actionModal} setAction={setActionModal} serviceType={serviceType} serviceName={serviceName} />}
		</>
	)
}

const styles = StyleSheet.create({
	actionsContainer: {
		width: '100%',
		height: '80%',
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
	}
})
