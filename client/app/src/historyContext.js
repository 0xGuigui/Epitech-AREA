import {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-native";

export const HistoryContext = createContext()

export const HistoryProvider = ({ children }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const [history, setHistory] = useState({
		path: location.pathname,
		prev: '/'
	})

	useEffect(() => {
		const newHistory = {
			path: location.pathname,
			prev: history[history.path === location.pathname ? 'prev' : 'path']
		}
		setHistory(newHistory)
		console.log(newHistory)
	}, [location])

	return (
		<HistoryContext.Provider value={history}>
			{children}
		</HistoryContext.Provider>
	)
}