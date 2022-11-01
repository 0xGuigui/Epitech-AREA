import AppFooter from "./footer";
import {Route, Routes, useLocation} from "react-router-native";
import MainPage from './mainPage'

export default function AppComponent({ userInfo }) {
	const location = useLocation()

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