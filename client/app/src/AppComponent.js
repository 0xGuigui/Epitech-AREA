import AppFooter from "./footer";
import {Route, Routes} from "react-router-native";
import MainPage from './mainPage'

export default function AppComponent({ userInfo }) {
	return (
		<>
			<Routes>
				<Route path="/main" element={<MainPage userInfo={userInfo} />} />
			</Routes>
			<AppFooter userInfo={userInfo} />
		</>
	)
}