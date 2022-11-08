import {useEffect} from "react";
import {useLocation} from "react-router-native";

export default function Oauth2({setUserInfo}) {
	const location = useLocation()

	const doStuff = async () => {

	}

	useEffect(() => {
		console.log(location)
	}, [])

	return (
		<>
		</>
	)
}