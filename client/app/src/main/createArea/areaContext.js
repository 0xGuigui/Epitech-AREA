import {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-native";

export const AreaContext = createContext()

export const AreaProvider = ({ children }) => {
	const [area, setArea] = useState({
		action: {},
		reaction: {}
	})

	useEffect(() => {
		console.log('area', area)
	}, [area])

	return (
		<AreaContext.Provider value={{area, setArea}}>
			{children}
		</AreaContext.Provider>
	)
}
