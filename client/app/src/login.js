import {View, Text, StyleSheet, Image} from 'react-native';
import {useEffect, useState} from 'react';
import { Button, IconButton, Stack, Pressable } from "@react-native-material/core";
import {Provider, TextInput} from 'react-native-paper';
const logo = require('./assets/logo/logo.png')


export default function Login({ setUserInfo }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  return (
    <View style={styles.loginSection}>
      <Image source={logo} style={styles.logo}/>
      <Text style={styles.loginWelcome}>AREA Project</Text>
      {/*<Provider theme={isDarkTheme ? DarkTheme : DefaultTheme}>*/}
      {/*  <View*/}
      {/*      style={[*/}
      {/*        styles.container,*/}
      {/*        {*/}
      {/*          backgroundColor: isDarkTheme*/}
      {/*              ? DarkTheme.colors.background*/}
      {/*              : DefaultTheme.colors.background,*/}
      {/*        },*/}
      {/*      ]}>*/}
      {/*    <Switch value={isDarkTheme} onValueChange={setIsDarkTheme} />*/}
      {/*    <TextInput placeholder="placeholder" label="Label" mode="outlined" />*/}
      {/*  </View>*/}
      {/*</Provider>*/}
      <TextInput variant="outlined"
                 label="Email"
                 onChangeText={e => setForm({...form, email: e})}
                 style={{ marginLeft: 16, marginRight: 16, marginTop: 16, color: '#212123'}}
                 inputStyle={{color: 'white'}} //texte
                 inputContainerStyle={{backgroundColor: '#212123'}}
                 placeholder="example@example.com"
      />
      <TextInput mode="outlined"
                 label="Password"
                 style={{ marginLeft: 16, marginRight: 16, marginTop: 10}}
                 inputContainterStyle={{backgroundColor: '#212123'}}
                 inputStyle={{color: 'white'}}
                 onChangeText={e => setForm({...form, password: e})}
                 placeholder="********"
      />
      <Button title="Connect" style={styles.registerButton} onClick={() => {
        // TODO check infos valides
        setUserInfo(form)
      }}/>
      <Button title="Register" style={{...styles.registerButton, marginTop: '4%'}}/>
      <Pressable style={styles.forgotSection} onPress={() => {
        console.log(form)
      }}>
        <Text style={styles.forgot}>forgot password ?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    top: 50,
    width: 150,
    height: 150,
    marginLeft: 'auto',
    marginRight: 'auto'

  },
  loginSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  loginWelcome: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    marginTop: 60,
  },
  emailInput: {
    marginTop: 100
  },
  forgotSection: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  forgot: {
    textAlign: 'center',
    fontSize: 15,
  },
  registerButton: {
    width: '75%',
    backgroundColor: '#9a5373',
    marginLeft: '12.5%',
    marginRight: '12.5%',
    marginTop: '10%',
  }
});
