import {useEffect} from "react";
import {useLocation, useParams, useSearchParams} from "react-router-native";

export default function Oauth2({setUserInfo}) {
	const location = useLocation()
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams();

	const doStuff = async () => {

	}

	useEffect(() => {
		console.log(location)
		console.log(params['service'])
		console.log(searchParams.get('code'))
	}, [])

	return (
		<>
		</>
	)
}
