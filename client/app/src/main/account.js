import {Platform, StyleSheet, ToastAndroid, View} from "react-native";
import {Appbar} from 'react-native-paper';
import { DarkTheme } from "../../config";
import * as React from "react";
import {useNavigate} from "react-router-native";

export default function Account({setUserInfo }) {
    const navigate = useNavigate()
    const showToast = () => {
        ToastAndroid.show("You are logged out", ToastAndroid.SHORT);
    };

    return (
        <View style={styles.view}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="cog" color={'white'} onPress={() => {
                    navigate('/settings')
                }} />
                <Appbar.Content title="My Account" titleStyle={{color: 'white'}} />
                <Appbar.Action icon={'logout'} color={'white'} onPress={() => {
                    setUserInfo(null)
                    if (Platform.OS === 'android') {
                        showToast()
                    }
                    navigate('/login')
                    navigate('/login')
                }} />
            </Appbar.Header>
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: '100%',
        backgroundColor: '#121313',
    },
})
