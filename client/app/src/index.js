import {StyleSheet, View} from 'react-native';
import Login from './loginMenu/login';
import Settings from './loginMenu/settings'
import { useEffect, useState } from "react";
import {Route, Routes, useNavigate} from "react-router-native";
import Main from "./main";
import {getMe, refreshToken} from "./services/server";
import Register from "./loginMenu/register";
import Forgot from "./loginMenu/forgot";

export default function Index() {
	const [userInfo, setUserInfo] = useState({})
	const navigate = useNavigate()

	const checkUser = async () => {
		const token = await refreshToken()
		if (token.status === 200) {
			const me = await getMe(token.token)
			if (me.status === 200) {
				return navigate('/main')
			}
		}
		navigate('/login')
	}

	useEffect(() => {
		checkUser()
	}, [userInfo])

	return (
		<View style={styles.app}>
			<Routes>
				<Route path='/login' element={<Login setUserInfo={setUserInfo} />} />
				<Route path='/register' element={<Register />} />
				<Route path='/forgot' element={<Forgot />} />
				<Route exact path="/settings" element={<Settings userInfo={userInfo} />} />
				<Route path="*" element={<Main userInfo={userInfo} />} />
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
