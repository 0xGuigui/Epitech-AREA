import {createContext, useState} from "react";

export const LoginContext = createContext()

export const LoginProvider = ({ children }) => {
	const [oauth2, setOauth2] = useState(false)

	return (
		<LoginContext.Provider value={{oauth2, setOauth2}}>
			{children}
		</LoginContext.Provider>
	)
}
