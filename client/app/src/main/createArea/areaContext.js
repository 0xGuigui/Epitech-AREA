import {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-native";

export const AreaContext = createContext()

export const AreaProvider = ({ children }) => {
	const [area, setArea] = useState({
		action: {},
		reaction: {}
	})

	return (
		<AreaContext.Provider value={area}>
			{children}
		</AreaContext.Provider>
	)
}
