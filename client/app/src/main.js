import AppFooter from "./footer/footer";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainPage from './mainPage'
import Account from "./account";

export default function Main({ userInfo }) {
	return (
		<>
			<Routes>
				<Route path="/main" element={<MainPage userInfo={userInfo} />} />
				<Route path="/account" element={<Account userInfo={userInfo}/>} />
			</Routes>
			<AppFooter userInfo={userInfo} />
		</>
	)
}