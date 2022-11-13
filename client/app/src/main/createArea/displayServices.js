import * as React from "react";
import {View, StyleSheet, BackHandler} from "react-native";
import {Text} from "react-native-paper";
import {useContext, useEffect, useState} from "react";
import {checkService, getServices, refreshToken} from "../../services/server";
import {useNavigate, useParams} from "react-router-native";
import {Oauth2} from '../../../config'
import * as WebBrowser from 'expo-web-browser'
import DataDisplayer from "../../dataDisplayer";
import {HistoryContext} from "../../historyContext";
import {showToast} from "../../utils";


import spotifyLogo from '../../assets/img/spotify_logo.png'
import discordLogo from '../../assets/img/discord_logo.png'
import redditLogo from '../../assets/img/reddit_logo.png'
import steamLogo from '../../assets/img/steam_logo.png'
import leagueLogo from '../../assets/img/League.png'
import areaLogo from '../../assets/logo/logo.png'

const logos = {
	Discord: discordLogo,
	Spotify: spotifyLogo,
	Reddit: redditLogo,
	Steam: steamLogo,
	League: leagueLogo,
	AREA: areaLogo
}

export default function DisplayServices() {
	const [actions, setActions] = useState([])
	const {serviceType} = useParams()
	const navigate = useNavigate()
	const history = useContext(HistoryContext)

	const getServerActions = async () => {
		const refresh = await refreshToken()
		refresh.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
		const about = await getServices(refresh.token)
		about.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
		setActions(about.services.filter(e => serviceType === 'action' ? e.actions.length > 0 : e.reactions.length > 0))
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
			<Text style={{fontSize: 40, color: 'white', textAlign: 'center', paddingBottom: 30}}>Choose a service</Text>
			<View style={styles.actionsContainer}>
				{actions.map((e, i) =>
					<>
						<DataDisplayer keyProp={i} text={e.name} style={styles.actions} textStyle={styles.actionsText} icon={logos[e.name]} colorBackground={e.colorPalette.secondaryColor} onPress={async () => {
							if (Oauth2[e.name]) {
								const token = await refreshToken()
								token.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
								const res = await checkService(token.token, e.name)
								if (res.status !== 200)
									return WebBrowser.openBrowserAsync(Oauth2[e.name].oauth_uri)
							}
							navigate(`/create/${serviceType}/${e.name}`)
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
		marginTop: '50%',
		marginBottom: 'auto'
	}
})
