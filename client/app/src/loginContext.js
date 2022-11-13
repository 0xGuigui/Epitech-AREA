import {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-native";

export const LoginContext = createContext()

export const LoginProvider = ({ children }) => {
	const location = useLocation()
	const [oauth2, setOauth2] = useState(false)

	return (
		<LoginContext.Provider value={{oauth2, setOauth2}}>
			{children}
		</LoginContext.Provider>
	)
}
