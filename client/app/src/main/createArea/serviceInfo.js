import {View, StyleSheet, BackHandler, Image, ScrollView} from "react-native";
import * as WebBrowser from 'expo-web-browser'
import {Appbar, Text, Button} from "react-native-paper";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-native";
import {HistoryContext} from "../../historyContext";
import spotifyLogo from '../../assets/img/spotify_logo.png'
import discordLogo from '../../assets/img/discord_logo.png'
import redditLogo from '../../assets/img/reddit_logo.png'
import steamLogo from '../../assets/img/steam_logo.png'
import leagueLogo from '../../assets/img/League.png'
import * as React from "react";
import { DarkTheme } from "../../../config";
import DiscordLogo from '../../assets/icons/discord-logo-white.png'
import SpotifyLogo from '../../assets/icons/spotify-logo-white.png'
import RedditLogo from '../../assets/icons/reddit-logo-white.png'
import SteamLogo from '../../assets/icons/steam-logo-white.png'
import LeagueLogo from '../../assets/icons/league-logo-white.png'
import AreaLogo from '../../assets/logo/logo.png'
import {checkService, refreshToken, unregisterService} from "../../services/server";
import {Oauth2, serverUrl} from '../../../config'
import {showToast} from "../../utils";

const data = {
    Discord: {
        description: 'Discord is a proprietary freeware VoIP application and digital distribution platform designed for video gaming communities, that specializes in text, image, video and audio communication between users in a chat channel. Discord runs on Windows, macOS, Android, iOS, Linux, and in web browsers.\n\nWhether you’re part of a school club, gaming group, worldwide art community, or just a handful of friends that want to spend time together, Discord makes it easy to talk every day and hang out more often.',
        url: 'https://discord.com/',
        backgroundColor: '#5865F2',
        headerLogo: DiscordLogo,
        logo: discordLogo
    },
    Spotify: {
        description: 'Spotify is a digital music, podcast, and video streaming service that gives you access to millions of songs and other content from artists all over the world. With Spotify, you can listen to millions of songs and podcasts for free. Listen to the songs and podcasts you love and find music from all over the world.\n\nSpotify is all the music you’ll ever need.',
        url: 'https://www.spotify.com/',
        backgroundColor: '#000000',
        headerLogo: SpotifyLogo,
        logo: spotifyLogo
    },
    Reddit: {
        description: 'Reddit is a social news aggregation, web content rating, and discussion website. Registered members submit content to the site such as links, text posts, and images, which are then voted up or down by other members. Content entries are organized by areas of interest called "subreddits".\n\nReddit is a place for community, conversation, and connection with millions of users worldwide. Whether you’re into breaking news, sports, TV fan theories, or a never-ending stream of the internet’s cutest animals, there’s a community on Reddit for you.',
        url: 'https://www.reddit.com/',
        backgroundColor: '#FF4500',
        headerLogo: RedditLogo,
        logo: redditLogo
    },
    Steam: {
        description: 'Steam is a digital distribution platform developed by Valve Corporation, which offers digital rights management (DRM), multiplayer gaming, video streaming and social networking services. It also provides the user with installation and automatic updating of games, and community features such as friends lists and groups, cloud saving, and in-game voice and chat functionality.',
        url: 'https://store.steampowered.com/',
        backgroundColor: '#102553',
        headerLogo: SteamLogo,
        logo: steamLogo
    },
    League: {
        description: 'League of Legends is a multiplayer online battle arena video game developed and published by Riot Games for Microsoft Windows and macOS. Inspired by the Warcraft III: The Frozen Throne mod Defense of the Ancients, the game follows a freemium model and is supported by microtransactions, and was inspired by the Warcraft III: The Frozen Throne mod Defense of the Ancients.\n\nLeague of Legends is a team-based game with over 140 champions to make epic plays with.',
        url: 'https://euw.leagueoflegends.com/',
        backgroundColor: '#044454',
        headerLogo: LeagueLogo,
        logo: leagueLogo
    },
    AREA: {
        description: 'AREA is a project that allows you to connect all your services in one place. You can create actions that will be triggered when a specific event occurs. For example, you can create an action that will send a message to your Discord server when you receive a new email.',
        url: `${serverUrl}:8081`,
        backgroundColor: '#000000',
        headerLogo: AreaLogo,
        logo: AreaLogo
    }
}

export default function ServiceInfo() {
    const {service} = useParams();
    const navigate = useNavigate()
    const history = useContext(HistoryContext)
    const [isConnected, setIsConnected] = useState(true)

    const backAction = () => {
    }

    useEffect(() => {
        const stuff = async () => {
            if (!Oauth2[service])
                return;
            const token = await refreshToken()
            token.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
            const checkToken = await checkService(token.token, service)
            checkToken.status !== 200 && setIsConnected(false)
        }
        stuff()
    })

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [history])

    console.log(service)
    return (
        <>
            <View style={{backgroundColor: data[service].backgroundColor}}>
                <Appbar.Header theme={DarkTheme}>
                    <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/listServices') }} />
                    <Appbar.Content title={`About ${service === 'League' ? 'League of Legends' : service}`} color={'white'} />
                </Appbar.Header>
                <Image source={data[service].headerLogo} style={{width: 200, height: 18, paddingTop: 30, paddingBottom: 30, marginTop: 25, marginBottom: 25, resizeMode: 'contain', alignSelf: 'center'}}/>
                <ScrollView>
                    <Text style={{backgroundColor: data[service].backgroundColor, color: 'white', textAlign: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 20, marginLeft: 20, marginRight: 20}}>{data[service].description}</Text>
                    {(!isConnected || Oauth2[service]) && <Button
                        buttonColor={'white'}
                        textColor={'black'}
                        mode="contained"
                        theme={{
                            roundness: 100,
                        }}
                        onPress={async () => {
                            if (isConnected) {
                                const token = await refreshToken()
                                token.status !== 200 && showToast('Disconnected from the server') && navigate('/login')
                                const res = await unregisterService(token.token, service)
                                showToast(res.status === 200 ? "Service disconnected" : "An error occurred")
                                setIsConnected(false)
                            } else {
                                WebBrowser.openBrowserAsync(Oauth2[service].oauth_uri)
                            }
                        }}
                        style={styles.button}
                    >
                        {(isConnected ? 'Disconnect from ' : 'Connect to ') + service}
                    </Button>}
                    <Text style={{backgroundColor: data[service].backgroundColor, color: 'white', textAlign: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 20, fontStyle: 'italic', textDecorationLine: 'underline'}} onPress={() => { WebBrowser.openBrowserAsync(data[service].url) }}>{data[service].url}</Text>
                    <Text style={{backgroundColor: data[service].backgroundColor, color: 'white', textAlign: 'center', fontSize: 20, marginBottom: 20, padding: 150}}></Text>
                </ScrollView>
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
    },
    button: {
        width: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '5%',
        marginBottom: '5%'
    },
})
