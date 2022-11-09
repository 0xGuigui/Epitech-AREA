import AppFooter from "./footer/footer";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainPage from './mainPage/mainPage'
import Account from "./account";
import CreateArea from "./createArea/create";
import {AreaProvider} from "./createArea/areaContext";
import {useEffect} from "react";

export default function MainRoutes({ userInfo, setUserInfo }) {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (location.pathname === '/' && userInfo)
			navigate('/main')
	}, [location])

	return (
		<>
			<Routes>
				<Route path="/main" element={<MainPage userInfo={userInfo} />} />
				<Route path="/create" element={
					<AreaProvider>
						<CreateArea />
					</AreaProvider>
				} />
				<Route path="/account" element={<Account userInfo={userInfo} setUserInfo={setUserInfo}/>} />
			</Routes>
			<AppFooter userInfo={userInfo} />
		</>
	)
}
