import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import {useEffect, useState} from 'react';
import Input from "./Components/input";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  console.log(form)

  return (
    <View style={styles.loginSection}>
      <Text style={styles.loginWelcome}>AREA</Text>
      <Input
          defaultValue=""
          value={form.email}
          style={styles.emailInput}
          label="email"
          placeholder="example@example.com"
          onChangeText={e => setForm({...form, email: e})} />
      <Input
          defaultValue=""
          value={form.password}
          label="password"
          placeholder="********"
          onChangeText={e => setForm({...form, password: e})}
          secureTextEntry />
      <View style={styles.registerButton}>
        <Button
            title="Connect"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loginWelcome: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    marginTop: 150,
  },
  emailInput: {
    marginTop: 100
  },
  registerButton: {
    width: '75%',
  }
});
