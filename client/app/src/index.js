import { StyleSheet, View } from 'react-native';
import Login from './loginMenu/login';
import { useEffect, useState } from "react";
import { Route, Routes, useDeepLinking, useLocation, useNavigate} from "react-router-native";
import MainRoutes from "./main/mainRoutes";
import { getMe, refreshToken } from "./services/server";
import Register from "./loginMenu/register";
import Forgot from "./loginMenu/forgot";
import { HistoryProvider } from "./historyContext";
import SettingsRoutes from "./loginMenu/settings/settingsRoutes";
import Oauth2 from "./oauth2";
import ChangeUserData from "./main/account/changeUserData"
import * as Linking from 'expo-linking'

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
				setUserInfo(me.user)
				const initialUrl = await Linking.getInitialURL();

				if (initialUrl) {
					const test = Linking.parse(initialUrl)
					return navigate(`${test.path}?${Object.keys(test.queryParams).map((e, i) => `${e}=${test.queryParams[e]}${i > 0 ? '&' : ''}`)}`)
				}
				return navigate('/main')
			}
		}
		navigate('/login')
	}

	checkUser()

	useEffect(() => {
		const {remove} = Linking.addEventListener('url', async ({url}) => {
			const token = await refreshToken()
			if (token.status === 200) {
				const test = Linking.parse(url)
				return navigate(`${test.path}?${Object.keys(test.queryParams).map((e, i) => `${e}=${test.queryParams[e]}${i > 0 ? '&' : ''}`)}`)
			}
		});
		return remove
	}, [])

	return (
		<HistoryProvider>
			<View style={styles.app}>
				<Routes>
					<Route path='/login' element={<Login setUserInfo={setUserInfo} />} />
					<Route path='/register' element={<Register />} />
					<Route path='/forgot' element={<Forgot />} />
					<Route path="/settings/*" element={<SettingsRoutes userInfo={userInfo}/>} />
					<Route path='/oauth2/:service' element={<Oauth2 setUserInfo={setUserInfo} userInfo={userInfo} />} />
					<Route path='/change/:data' element={<ChangeUserData userInfo={userInfo} setUserInfo={setUserInfo} />} />
					<Route path='/manageServices' element={<ManageServices />} />
					<Route path="*" element={<MainRoutes userInfo={userInfo} setUserInfo={setUserInfo} />} />
				</Routes>
			</View>
		</HistoryProvider>
	);
}

const styles = StyleSheet.create({
	app: {
		width: '100%',
		height: '100%',
		backgroundColor: '#121313',
	}
});
