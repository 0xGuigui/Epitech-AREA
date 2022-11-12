import { useContext, useEffect, useState } from "react";
import {Alert, BackHandler, Platform, StyleSheet, Text, View} from "react-native";
import {useNavigate, useParams} from "react-router-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import { isEmail, showToast } from '../../utils'
import { HistoryContext } from "../../historyContext";
import { DarkTheme, Oauth2 } from "../../../config";
import * as React from "react";
import {checkService, getServices, refreshToken} from "../../services/server";
import DataDisplayer from "../../dataDisplayer";
import * as WebBrowser from "expo-web-browser";

import spotifyLogo from '../../assets/img/spotify_logo.png'
import discordLogo from '../../assets/img/discord_logo.png'
import redditLogo from '../../assets/img/reddit_logo.png'
import steamLogo from '../../assets/img/steam_logo.png'
import leagueLogo from '../../assets/img/League.png'

const logos = {
    Discord: discordLogo,
    Spotify: spotifyLogo,
    Reddit: redditLogo,
    Steam: steamLogo,
    League: leagueLogo
}

export default function ManageServices({userInfo, setUserInfo}) {
    const navigate = useNavigate()
    const history = useContext(HistoryContext)
    const [actions, setActions] = useState([])
    const {serviceType} = useParams()


    const getServerActions = async () => {
        const refresh = await refreshToken()
        refresh.status !== 200 && navigate('/login')
        const about = await getServices(refresh.token)
        about.status !== 200 && navigate('/login')
        setActions(about.services.filter(e => Object.keys(Oauth2).find(el => el === e.name)))
    }

    useEffect(() => {
        getServerActions()
    }, [])

    return (
        (
            <>
                <Appbar.Header theme={DarkTheme}>
                    <Appbar.BackAction icon="arrow-left" color={'white'} onPress={() => navigate('/account')}/>
                    <Appbar.Content title="Manage services" color='white'/>
                </Appbar.Header>
                <Text style={{fontSize: 40, color: 'white', textAlign: 'center', paddingBottom: 30}}>Choose a service</Text>
                <View style={styles.actionsContainer}>
                    {actions.map((e, i) =>
                        <>
                            <DataDisplayer keyProp={i} text={e.name} style={styles.actions} textStyle={styles.actionsText} icon={logos[e.name]} colorBackground={e.colorPalette.secondaryColor} onPress={async () => {
                                const token = await refreshToken()
                                if (token.status === 200) {
                                    const res = await checkService(token.token, e.name)
                                    if (res.status === 200) {
                                        Alert.alert(
                                            "Disconnect service",
                                            `Are you sure you want to disconnect ${e.name} ?`,
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: async () => {
                                                        const token = await refreshToken()
                                                        console.log('ok')
                                                        if (token) {
                                                            const res = await checkService(token.token, e.name)
                                                            if (res.status === 200) {
                                                                await WebBrowser.openAuthSessionAsync(res.url)
                                                                showToast("Service disconnected")
                                                            }
                                                        }
                                                    }
                                                }
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                    if (res.status !== 200) {
                                        Alert.alert(
                                            "Not connected",
                                            `You are not connected to ${e.name}, do you want to connect ?`,
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: async () => {
                                                        const token = await refreshToken()
                                                        if (token) {
                                                            const res = await checkService(token.token, e.name)
                                                            if (res.status !== 200) {
                                                                console.log('Ok')
                                                                return WebBrowser.openBrowserAsync(Oauth2[e.name].oauth_uri)
                                                            }
                                                        }
                                                    }
                                                },
                                            ],
                                            {cancelable: false}
                                        );
                                    }
                                }
                            }}/>
                        </>
                    )}
                    {actions.length % 2 === 1 && <View style={{...styles.actions, borderWidth: 0}}/>}
                </View>
            </>
        )
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

