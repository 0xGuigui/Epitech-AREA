import {StyleSheet, View} from 'react-native';
import Login from './login';
import Settings from './settings'
import { useEffect, useState } from "react";
import {Route, Routes, useNavigate} from "react-router-native";
import AppComponent from "./AppComponent";
import {getMe, refreshToken} from "./Services/server";
import Register from "./register";

export default function App() {
	const [userInfo, setUserInfo] = useState({})
	const navigate = useNavigate()

	const checkUser = async () => {
		const token = await refreshToken()
		if (token.status === 200) {
			const me = await getMe(token.token)
			if (me.status === 200) {
				navigate('/main')
			}
		}
	}

	useEffect(() => {
		checkUser()
	}, [userInfo])

	return (
		<View style={styles.app}>
			<Routes>
				<Route exact path='/login' element={<Login setUserInfo={setUserInfo} />} />
				<Route exact path='/register' element={<Register />} />
				<Route exact path="/settings" element={<Settings userInfo={userInfo} />} />
				<Route path="*" element={<AppComponent userInfo={userInfo} />} />
			</Routes>
		</View>
	);
}

const styles = StyleSheet.create({
	app: {
		width: '100%',
		height: '100%',
		backgroundColor: '#212123',
	}
});
