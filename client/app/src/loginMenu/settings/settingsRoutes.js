import {Route, Routes, useLocation} from "react-router-native";
import Settings from "./settings";
import {useContext, useEffect, useState} from "react";
import {HistoryContext} from "../../historyContext";

export default function SettingsRoutes() {
	const history = useContext(HistoryContext)
	const location = useLocation()
	const [prevHistory, setPrevHistory] = useState(history.prev)

	useEffect(() => {
		if (location.pathname === '/settings' && history.prev.split('/')[1] !== 'settings')
			setPrevHistory(history.path.split('/')[1] !== 'settings' ? history.prev : history.path)
	}, [location])

	return (
		<Routes>
			<Route exact path='/' element={<Settings prevHistory={prevHistory} />} />
		</Routes>
	)
}
