import AppFooter from "./footer/footer";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainPage from './mainPage/mainPage'
import Account from "./account";
import CreateArea from "./createArea/create";
import {useEffect} from "react";

export default function MainRoutes({ userInfo, setUserInfo }) {
	const navigate = useNavigate()

	useEffect(() => {
		if (!(userInfo?._id))
			navigate('/login')
	}, [userInfo])

	return (
		<>
			<Routes>
				<Route path="/main" element={<MainPage userInfo={userInfo} />} />
				<Route path="/create" element={<CreateArea />} />
				<Route path="/account" element={<Account userInfo={userInfo} setUserInfo={setUserInfo}/>} />
			</Routes>
			<AppFooter userInfo={userInfo} />
		</>
	)
}
