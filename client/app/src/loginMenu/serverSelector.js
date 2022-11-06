import { Pressable } from "@react-native-material/core";
import {Button, TextInput, IconButton} from 'react-native-paper';
import {getMe, logUser} from "../services/server";
import { Appbar, MD3DarkTheme, MD3LightTheme, Divider } from 'react-native-paper';
import {ScrollView, useColorScheme, BackHandler, Animated, Platform, View, Text, StyleSheet, Image} from "react-native";
import { useNavigate } from "react-router-native";
import {useEffect, useState} from "react";
import * as React from "react";

export default function ServerSelector() {
    let theme = useColorScheme() === 'dark' ? MD3DarkTheme : MD3LightTheme;
    const navigate = useNavigate();
    const { colors } = theme;
    const backAction = async () => {
        navigate('/login')
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    return (
        <View style={{ backgroundColor: colors.background }}>
            <Appbar.Header theme={DarkTheme}>
                <Appbar.Action icon="arrow-left-thick" color={'white'} onPress={() => { navigate('/settings') }} />
                <Appbar.Content title="Server Settings" titleStyle={{color: 'white'}} />
            </Appbar.Header>
        </View>
    )
}

const DarkTheme = {
    ...MD3LightTheme,
    dark: true,

    colors: {
        ...MD3LightTheme.colors,
        primary: '#9a5373',
        accent: '#f1c40f',
        background: '#2c3e50',
        surface: '#121313',
        text: '#ecf0f1',
        textColor: '#ecf0f1',
        disabled: '#ecf0f1',
        placeholder: '#ecf0f1',
        backdrop: '#34495e',
        notification: '#f1c40f',
    },
};
