import {Alert, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import { Appbar, Divider } from 'react-native-paper';
import { DarkTheme } from "../../config";
import * as React from "react";
import { useNavigate } from "react-router-native";
import {getActions, getMe, refreshToken} from "../services/server";
import {useEffect} from "react";
import { logOut, deleteAccount } from '../services/server'
import { showToast } from '../utils'

export default function Account({ userInfo, setUserInfo }) {
    const navigate = useNavigate()
    const global = require('../../config')
    const createAlertDeleteAccount = () =>
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        showToast('Account deleted, you will be logged out')
                        navigate('/login')
                        deleteAccount(userInfo, setUserInfo).then(r => console.log(r))
                    } }
            ],
            { cancelable: false }
        );


    return (
        <View style={styles.view}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Content title="My Account" style={{alignItems: 'center'}} titleStyle={{color: 'white'}} />
                <Appbar.Action icon={'logout'} color={'white'} onPress={async () => {
                    const token = await refreshToken()
                    const res = await logOut(token.token)
                    if (res.status === 200) {
                        setUserInfo({})
                        navigate('/login')
                        if (Platform.OS === 'android')
                            showToast('You have been logged out')
                    }
                }} />
            </Appbar.Header>
            <ScrollView>
                <Text
                    style={styles.titleText}>
                    Services
                </Text>
                <Divider/>
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Enable/Disable services
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Connect to a service
                </Text>
                <Divider/>
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Disconnect from a service
                </Text>
                <Divider/>
                <Text
                    style={styles.titleText}>
                    Account
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Change email
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Change password
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => console.log("Coucou")}>
                    Change username
                </Text>
                <Divider />
                <Text
                    style={{...styles.clickableText, color: 'red'}} onPress={async () => {
                    const token = await refreshToken()
                    const res = await logOut(token.token)
                    if (res.status === 200) {
                        setUserInfo({})
                        navigate('/login')
                        if (Platform.OS === 'android')
                            showToast('You have been logged out')
                    }
                }}>
                    Log out
                </Text>
                <Divider />
                <Text
                    style={{...styles.clickableText, color: 'red'}} onPress={
                    () => {
                        createAlertDeleteAccount()
                    }
                }>
                    Delete account
                </Text>
                <Divider />
            </ScrollView>
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
        color: '#dfdfde',
        fontSize: 20,
        textAlign: 'left',
        backgroundColor: "#121313",
        paddingBottom: 20,
        padding: 20,
        fontWeight: 'bold',
    },
    endOfScroll: {
        padding: Platform.OS === 'ios' ? 100 : 50,
        color: "#121313",
        backgroundColor: "#121313",
    }
})
