import {Alert, BackHandler, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {Appbar, Divider} from 'react-native-paper';
import { DarkTheme } from "../../config";
import * as React from "react";
import { useNavigate } from "react-router-native";
import { refreshToken, logOut, deleteAccount, resetPassword } from "../services/server";
import { showToast } from '../utils'
import {useContext, useEffect} from "react";
import {HistoryContext} from "../historyContext";

export default function Account({ userInfo, setUserInfo }) {
    const navigate = useNavigate()
    const history = useContext(HistoryContext)
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
                { text: "OK", onPress: async () => {
                        const token = await refreshToken()
                        if (token) {
                            const res = await deleteAccount(token)
                            if (res) {
                                await logOut()
                                navigate('/login')
                                showToast("Account deleted")
                            }
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    const backAction = () => {
        navigate(history.prev)
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [history])

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
                    Help
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => navigate('/listServices')}>
                    What is Area?
                </Text>
                <Divider />
                <Text
                    style={styles.titleText}>
                    Services
                </Text>
                <Divider/>
                <Text
                    style={styles.clickableText} onPress={() => navigate('/listServices')}>
                    Available Services
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => navigate('/manageServices')}>
                    Manage services
                </Text>
                <Divider/>
                <Text
                    style={styles.titleText}>
                    Account
                </Text>
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => {
                    navigate('/change/email')
                }}>
                    Change email
                </Text>
                <Divider />
                { !userInfo.oauth &&
                    <Text
                        style={styles.clickableText} onPress={() => {
                        navigate('/change/password')
                    }}>
                        Change password
                    </Text>
                }
                <Divider />
                <Text
                    style={styles.clickableText} onPress={() => {
                    navigate('/change/username')
                }}>
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
                    } if (res.status !== 200 || !res || !token) {
                        showToast('Something went wrong')
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
                <Text style={styles.endOfScroll}/>
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
