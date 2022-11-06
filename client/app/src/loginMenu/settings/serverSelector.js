import {Button, TextInput} from 'react-native-paper';
import { Appbar, MD3LightTheme } from 'react-native-paper';
import {BackHandler, View} from "react-native";
import { useNavigate } from "react-router-native";
import {useEffect, useState} from "react";
import * as React from "react";
import {isIpDomain, isPort} from "../../utils";

export default function ServerSelector() {
    const [formIP, setFormIP] = useState("92.148.23.72");
    const [formPort, setFormPort] = useState("8080");
    const navigate = useNavigate();
    const backAction = async () => {
        navigate('/login')
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    return (
        <View style={{backgroundColor: "#121313"}}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/settings') }} />
                <Appbar.Content title="Server Settings" titleStyle={{color: 'white'}} />
            </Appbar.Header>
            <TextInput
                label="Server URL"
                mode="flat"
                defaultValue={formIP}
                keyboardType="url"
                style={{margin: 10}}
                activeOutlineColor="#9a5373"
                value={formIP}
                onChangeText={text => setFormIP(text)}
            />
            <TextInput
                label="Port"
                mode="flat"
                defaultValue={formPort}
                value={formPort}
                keyboardType="numeric"
                style={{margin: 10}}
                activeOutlineColor="#9a5373"
                onChangeText={text => setFormPort(text)}
            />
            <Button
                mode="contained"
                style={{margin: 10, backgroundColor: "#9a5373"}}
                theme={{
                    roundness: 1,
                }}
                onPress={() => {
                    if (isIpDomain(formIP) && isPort(formPort)) {
                        console.log("IP: " + formIP + " Port: " + formPort);
                    } else {
                        alert("Invalid IP or port");
                    }
                }}>
                Save
            </Button>
        </View>
    );
}

const DarkTheme = {
    ...MD3LightTheme,
    dark: true,

    colors: {
        ...MD3LightTheme.colors,
        primary: '#9a5373',
        accent: '#f1c40f',
        background: '#121313',
        surface: '#121313',
        text: '#ecf0f1',
        textColor: '#ecf0f1',
        disabled: '#ecf0f1',
        placeholder: '#ecf0f1',
        backdrop: '#121313',
        notification: '#f1c40f',
    },
};
