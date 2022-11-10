import {useNavigate, useParams} from "react-router-native";
import {checkService, getAbout, refreshToken} from "../../services/server";
import {useEffect, useState} from "react";
import {Oauth2} from "../../../config";
import * as WebBrowser from "expo-web-browser";
import {StyleSheet, View} from "react-native";
import DataDisplayer from "../../dataDisplayer";

export default function ChooseAction() {
	const {serviceType, serviceName} = useParams()
	const [actions, setActions] = useState([])
	const navigate = useNavigate()
	const [actionModal, setActionModal] = useState(undefined)

	const getServerActions = async () => {
		const about = await getAbout()
		about.status !== 200 && navigate('/login')
		setActions(about.server.services.find(e => e.name === serviceName)[serviceType === "action" ? "actions" : "reactions"])
	}

	useEffect(() => {
		getServerActions()
	}, [])

	console.log(actions)

	return (
		<>
			<View key='actionKey' style={styles.actionsContainer}>
				{actions.map((e, i) =>
					<>
						<DataDisplayer key={i} text={e.name} style={styles.actions} textStyle={styles.actionsText} onPress={async () => {

						}} />
					</>
				)}
				{actions.length % 2 === 1 && <View style={{...styles.actions, borderWidth: 0}}/>}
			</View>
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
