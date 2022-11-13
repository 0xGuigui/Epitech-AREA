import {useContext, useEffect} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-native";
import { DarkTheme } from "../config";
import {Image, StyleSheet, View, BackHandler} from "react-native";
import {Button, Text} from "react-native-paper";
import spotifyLogo from './assets/img/spotify_logo.png'
import discordLogo from './assets/img/discord_logo.png'
import twitchLogo from './assets/img/twitch_logo.png'
import redditLogo from './assets/img/reddit_logo.png'
import steamLogo from './assets/img/steam_logo.png'
import leagueLogo from './assets/img/League.png'
import {HistoryContext} from "./historyContext";
import {getMe, loginDiscord, refreshToken, registerService} from "./services/server";
import {LoginContext} from "./loginContext";
import {showToast} from "./utils";

const logos = {
	Discord: discordLogo,
	Spotify: spotifyLogo,
	Reddit: redditLogo,
	Twitch: twitchLogo,
	League: leagueLogo,
	Steam: steamLogo
}

export default function Oauth2({setUserInfo}) {
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams();
	const history = useContext(HistoryContext)
	const navigate = useNavigate()
	const {oauth2, setOauth2} = useContext(LoginContext)

	const registerCode = async () => {
		if (oauth2) {
			setOauth2(false)
			const token = await loginDiscord(searchParams.get('code'))
			if (token.status !== 200) {
				alert(token.message)
				return navigate('/login')
			}
			const me = await getMe(token.token)
			setUserInfo(me.user)
			navigate('/')
		} else {
			const token = await refreshToken()
			token.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
			await registerService(token.token, params.service, searchParams.get('code'))
		}
	}

	useEffect(() => {
		if (searchParams.get('code'))
			registerCode()
	}, [])

	const backAction = () => {
		navigate(history.prev)
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<View style={ DarkTheme.container }>
			<Image source={logos[params.service]} style={styles.logo}/>
			<Text style={styles.titleText}>{searchParams.get('code') ? `Connected to ${params.service}` : `Connection to ${params.service} refused`}</Text>
			<Button
				mode="contained"
				onPress={backAction}
				style={styles.button}
				buttonColor="#9a5373"
				theme={{
					roundness: 1,
				}}
			>
				CONTINUE
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	view: {
		width: '100%',
		height: '100%',
		backgroundColor: '#121313',
	},
	clickableText: {
		textAlign: 'left',
		fontSize: 14,
		margin: 0,
		padding: 20,
		backgroundColor: "#1e1f1f",
		color: 'white'
	},
	titleText: {
		textAlign: 'center',
		fontSize: 25,
		top: 300,
		color: 'white'
	},
	logo: {
		top: 250,
		width: 150,
		height: 150,
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	button: {
		top: 350,
		width: '75%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '4%'
	}
})
