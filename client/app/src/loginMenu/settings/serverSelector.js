import {Button, TextInput, Checkbox, Text} from 'react-native-paper';
import { Appbar, MD3LightTheme } from 'react-native-paper';
import { Alert, BackHandler, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useEffect, useState } from "react";
import * as React from "react";
import { isIpDomain, isPort } from "../../utils";
import { HistoryContext } from "../../historyContext";
import { DarkTheme } from "../../../config";

export default function ServerSelector() {
    const { history } = React.useContext(HistoryContext);
    const [formIP, setFormIP] = useState("92.148.23.72");
    const [formPort, setFormPort] = useState("8080");
    const navigate = useNavigate();
    const [checked, setChecked] = React.useState(false);
    const createAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
    const backAction = async () => {
        navigate(history.prev)
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
                activeUnderlineColor='#9a5373'
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
                activeUnderlineColor='#9a5373'
                onChangeText={text => setFormPort(text)}
            />
            <Text style={{color:'white', margin: 10}}>Use HTTPS <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => { setChecked(!checked); }} /></Text>
            <Button
                mode="contained"
                style={{margin: 10, backgroundColor: "#9a5373"}}
                theme={{
                    roundness: 1,
                }}
                onPress={() => {
                    if (isIpDomain(formIP) && isPort(formPort) || formIP === "localhost") {
                        console.log("IP: " + formIP + " Port: " + formPort);
                    } else {
                        createAlert("Error", "Invalid IP or Port");
                    }
                }}>
                Save
            </Button>
        </View>
    );
}
