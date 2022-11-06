import {Route, Routes} from "react-router-native";
import Settings from "./settings";
import ServerSelector from "./serverSelector";

export default function SettingsRoutes({userInfo}) {
	return (
		<Routes>
			<Route exact path='/' element={<Settings />} />
			<Route path='/server' element={<ServerSelector />} />
		</Routes>
	)
}