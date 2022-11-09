import {useContext, useEffect} from "react";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-native";
import { DarkTheme } from "../config";
import {Image, StyleSheet, View, BackHandler} from "react-native";
import {Button, Text} from "react-native-paper";
const spotifyLogo = require('./assets/img/spotify_logo.png')
const discordLogo = require('./assets/img/discord_logo.png')
const twitchLogo = require('./assets/img/twitch_logo.png')
const redditLogo = require('./assets/img/reddit_logo.png')
import {HistoryContext} from "./historyContext";

const logos = {
	Discord: discordLogo,
	Spotify: spotifyLogo,
	Reddit: redditLogo,
	Twitch: twitchLogo
}

export default function Oauth2({setUserInfo}) {
	const location = useLocation()
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams();
	const history = useContext(HistoryContext)
	const navigate = useNavigate()

	const doStuff = async () => {

	}

	const backAction = () => {
		navigate(history.prev)
	}

	useEffect(() => {
		console.log(params['service'])
		console.log(searchParams.get('code'))
	}, [])

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [history])

	return (
		<View style={ DarkTheme.container }>
			<Image source={logos[params.service]} style={styles.logo}/>
			<Text style={styles.titleText}>Connected to {params.service}</Text>
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
