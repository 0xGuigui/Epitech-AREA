import { DarkTheme } from "../../../config";
import {View} from "react-native";
import {Text} from "react-native-paper";

export default function DisplayServices({serviceType}) {
	// Note a moi même
	// Si égale a réaction, display tous les services qui proposent des réactions
	// Si égale à action, display tous les services qui proposent des actions

	return (
		<View style={DarkTheme}>
			<Text>Display services</Text>
			<Text>{serviceType}</Text>

		</View>
	)
}



