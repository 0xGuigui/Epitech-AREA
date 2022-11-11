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
        <View style={DarkTheme.container}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate(history.prev) }} />
                <Appbar.Content title="Manage services" titleStyle={{color: 'white'}} />
            </Appbar.Header>
            <View style={DarkTheme.subView}>
                <View style={DarkTheme.subsubView}>
                    {actions.map((e, i) =>
                        <>
                            <Button
                                keyProp={i}
                                style={styles.actions}
                                mode="contained"
                                theme={{
                                    roundness: 1,
                                }}
                                onPress={async () => {
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
                                }}
                            >
                                {e.name}
                            </Button>
                        </>
                    )}
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    accountText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'transparent',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
    },
    actions: {
        marginTop: 20,
        marginHorizontal: 10,
    }
})

