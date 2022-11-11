import { useContext, useEffect, useState } from "react";
import {BackHandler, Platform, StyleSheet, Text, View} from "react-native";
import { useNavigate } from "react-router-native";
import { changeUsername, logOut, refreshToken, resetPassword } from "../../services/server";
import { Appbar, Button, TextInput } from "react-native-paper";
import { isEmail, showToast } from '../../utils'
import { HistoryContext } from "../../historyContext";
import { DarkTheme } from "../../../config";
import * as React from "react";

export default function changePassword({userInfo, setUserInfo}) {
    const navigate = useNavigate()
    const history = useContext(HistoryContext)

    return (
        <View style={DarkTheme.container}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate(history.prev) }} />
                <Appbar.Content title="Change password" titleStyle={{color: 'white'}} />
            </Appbar.Header>
            <View style={DarkTheme.subView}>
                <View style={DarkTheme.subsubView}>
                    <Text style={{...styles.accountText}}>Change password</Text>
                    <TextInput
                        mode="flat"
                        activeUnderlineColor='#9a5373'
                        label='Enter your current password'
                        style={styles.input}
                        placeholder="********"
                    />
                    <TextInput
                        mode="flat"
                        activeUnderlineColor='#9a5373'
                        label='Enter your new password'
                        style={styles.input}
                        placeholder="********"
                    />
                    <TextInput
                    mode="flat"
                    activeUnderlineColor='#9a5373'
                    label='Enter your new password again'
                    style={styles.input}
                    placeholder="********"
                    />
                    <Button
                        mode="contained"
                        style={styles.button}
                        buttonColor="#9a5373"
                        theme={{
                            colors: {
                                primary: '#9a5373',
                            },
                        }}
                        onPress={ async () => {
                            const token = await refreshToken()
                            if (token.status === 200) {
                                const res = await changeUsername(token.token)
                                if (res.status === 200) {
                                    setUserInfo({...userInfo, username: res.user.username})
                                    showToast('Username changed')
                                    navigate('/account')
                                }
                                else {
                                    showToast('Failed to change your password')
                                }
                            } else {
                                showToast('Failed to change your password')
                            }
                        }}>
                        Change password
                    </Button>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: '100%',
        backgroundColor: '#121313',
    },
    subView: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    subsubView: {
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    accountText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
    },
    input: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 15,
        color: 'white',
        trailingContainerStyle: 'white'
    },
    button: {
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        height: 40,
        justifyContent: 'center'
    },
    backButton: {
        marginLeft: '2%',
        marginRight:'auto',
        marginTop: '12%'
    },
    errorText: {
        color: '#d51c1c',
        textAlign: 'center',
        marginTop: 2
    }
});
