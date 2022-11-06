import {StyleSheet, View} from 'react-native';
import Login from './loginMenu/login';
import Settings from './loginMenu/settings'
import { useEffect, useState } from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainRoute from "./main/mainRoute";
import {getMe, refreshToken} from "./services/server";
import Register from "./loginMenu/register";
import Forgot from "./loginMenu/forgot";
import {HistoryProvider} from "./historyContext";

export default function Index() {
	const [userInfo, setUserInfo] = useState({})
	const navigate = useNavigate()
	const location = useLocation()

	const checkUser = async () => {
		if (location.pathname !== '/')
			return;
		const token = await refreshToken()
		if (token.status === 200) {
			const me = await getMe(token.token)
			if (me.status === 200) {
				setUserInfo(me)
				return navigate('/main')
			}
		}
		navigate('/login')
	}

	checkUser()

	return (
		<HistoryProvider>
			<View style={styles.app}>
				<Routes>
					<Route path='/login' element={<Login setUserInfo={setUserInfo} />} />
					<Route path='/register' element={<Register />} />
					<Route path='/forgot' element={<Forgot />} />
					<Route exact path="/settings" element={<Settings userInfo={userInfo} />} />
					<Route path="*" element={<MainRoute userInfo={userInfo} setUserInfo={setUserInfo} />} />
				</Routes>
			</View>
		</HistoryProvider>
	);
}

const styles = StyleSheet.create({
	app: {
		width: '100%',
		height: '100%',
		backgroundColor: '#212123',
	}
});
