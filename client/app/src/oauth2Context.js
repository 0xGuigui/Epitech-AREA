import {createContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-native";

export const Oauth2Context = createContext()

export const Oauth2Provider = ({ children }) => {
	const [oauth2, setOauth2] = useState({
		service: ''
	})

	return (
		<Oauth2Context.Provider value={{oauth2, setOauth2}}>
			{children}
		</Oauth2Context.Provider>
	)
}
