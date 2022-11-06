import {StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";

export default function ActionDisplay({action, style, textStyle}) {


	return (
		<Pressable style={{...style}}>
			<Text style={{...textStyle}}>
				{action.name}
			</Text>
		</Pressable>
	)
}
