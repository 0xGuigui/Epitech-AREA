import {View, StyleSheet, BackHandler, Image} from "react-native";
import {Appbar, Text, Button} from "react-native-paper";
import {useContext, useEffect, useState} from "react";
import {checkService, getServices, refreshToken} from "../../services/server";
import {useNavigate, useParams} from "react-router-native";
import {Oauth2} from '../../../config'
import * as WebBrowser from 'expo-web-browser'
import DataDisplayer from "../../dataDisplayer";
import {HistoryContext} from "../../historyContext";
import spotifyLogo from '../../assets/img/spotify_logo.png'
import discordLogo from '../../assets/img/discord_logo.png'
import redditLogo from '../../assets/img/reddit_logo.png'
import steamLogo from '../../assets/img/steam_logo.png'
import leagueLogo from '../../assets/img/League.png'
import * as React from "react";
import { DarkTheme } from "../../../config";
import {assets} from "../../../config";
import DiscordLogo from '../../assets/icons/discord-logo-white.png'
import DiscordFont from '../../assets/fonts/Uni Sans Regular.ttf'

const logos = {
    Discord: discordLogo,
    Spotify: spotifyLogo,
    Reddit: redditLogo,
    Steam: steamLogo,
    League: leagueLogo
}

export default function ServiceInfo() {
    const navigate = useNavigate()
    const history = useContext(HistoryContext)

    const backAction = () => {
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [history])

    return (
        <>
            <View style={{backgroundColor: "#5865F2"}}>
                <Appbar.Header theme={DarkTheme}>
                    <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/listServices') }} />
                    <Appbar.Content title="About Discord" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <Image source={DiscordLogo} style={{width: 200, height: 36, alignSelf: 'center', marginTop: 40, marginBottom: 40}}/>
                <Text style={{backgroundColor: "#5865F2", color: 'white', textAlign: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 20}}>
                    Discord is a proprietary freeware VoIP application and digital distribution platform designed for video gaming communities, that specializes in text, image, video and audio communication between users in a chat channel. Discord runs on Windows, macOS, Android, iOS, Linux, and in web browsers.
                </Text>
                <Text style={{backgroundColor: "#5865F2", color: 'white', textAlign: 'center', fontSize: 20, marginBottom: 20, padding: 20}}>
                    Whether you’re part of a school club, gaming group, worldwide art community, or just a handful of friends that want to spend time together, Discord makes it easy to talk every day and hang out more often.
                </Text>
                <Button
                    buttonColor={'white'}
                    textColor={'black'}
                    mode="contained"
                    theme={{
                        roundness: 100,
                    }}
                    onPress={() => {}}
                    style={styles.button}
                >
                    Connect to Discord
                </Button>
                <Text style={{backgroundColor: "#5865F2", color: 'white', textAlign: 'center', fontSize: 20, marginBottom: 20, padding: 200}}></Text>
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
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
})
