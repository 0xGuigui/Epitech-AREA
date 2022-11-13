import {createContext, useState} from "react";

export const AreaContext = createContext()

export const AreaProvider = ({ children }) => {
	const [area, setArea] = useState({
		action: {},
		reaction: {},
		name: ''
	})

	return (
		<AreaContext.Provider value={{area, setArea}}>
			{children}
		</AreaContext.Provider>
	)
}
