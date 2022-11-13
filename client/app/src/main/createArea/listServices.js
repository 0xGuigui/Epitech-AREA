import {View, StyleSheet, BackHandler} from "react-native";
import {Appbar, Text} from "react-native-paper";
import {useContext, useEffect, useState} from "react";
import {checkService, getServices, refreshToken} from "../../services/server";
import {useNavigate, useParams} from "react-router-native";
import DataDisplayer from "../../dataDisplayer";
import {HistoryContext} from "../../historyContext";
import spotifyLogo from '../../assets/img/spotify_logo.png'
import discordLogo from '../../assets/img/discord_logo.png'
import redditLogo from '../../assets/img/reddit_logo.png'
import steamLogo from '../../assets/img/steam_logo.png'
import leagueLogo from '../../assets/img/League.png'
import * as React from "react";
import { DarkTheme } from "../../../config";
const logos = {
    Discord: discordLogo,
    Spotify: spotifyLogo,
    Reddit: redditLogo,
    Steam: steamLogo,
    League: leagueLogo
}

export default function ListServices() {
    const [actions, setActions] = useState([])
    const {serviceType} = useParams()
    const navigate = useNavigate()
    const history = useContext(HistoryContext)
    const LeagueColor = '#044454'

    const getServerActions = async () => {
        const refresh = await refreshToken()
        refresh.status !== 200 && navigate('/login')
        const about = await getServices(refresh.token)
        about.status !== 200 && navigate('/login')
        setActions(about.services)
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
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/account') }} />
                <Appbar.Content title="Available services" titleStyle={{ color: 'white' }} />
            </Appbar.Header>
            <Text style={{fontSize: 40, color: 'white', textAlign: 'center', paddingBottom: 30}}>Choose a service</Text>
            <View style={styles.actionsContainer}>
                {actions.map((e, i) =>
                    <>
                        <DataDisplayer keyProp={i} text={e.name} style={styles.actions} textStyle={styles.actionsText} icon={logos[e.name]} colorBackground={e.colorPalette.secondaryColor} onPress={async () => {
                            navigate('/info/' + e.name)
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
