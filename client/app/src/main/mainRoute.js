import AppFooter from "./footer/footer";
import {Route, Routes, useLocation, useNavigate} from "react-router-native";
import MainPage from './mainPage/mainPage'
import Account from "./account";
import CreateArea from "./createArea/create";
import ServerSelector from "../loginMenu/serverSelector";

export default function MainRoute({ userInfo, setUserInfo }) {
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
