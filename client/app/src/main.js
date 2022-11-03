import AppFooter from "./footer";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainPage from './mainPage'
import {useEffect} from "react";
import {BackHandler} from "react-native";

export default function Main({ userInfo }) {
	const location = useLocation()
	const navigate = useNavigate()

	const backAction = async () => {
		navigate('/login')
	}

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);

		return () =>
			BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [])
	console.log(location.pathname)

	return (
		<>
			<Routes>
				<Route path="/main" element={<MainPage userInfo={userInfo} />} />
			</Routes>
			<AppFooter userInfo={userInfo} />
		</>
	)
}