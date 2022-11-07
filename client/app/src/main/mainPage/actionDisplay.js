import {StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";

export default function ActionDisplay({action, style, textStyle, onPress}) {


	return (
		<Pressable style={{...style}} onPress={onPress}>
			<Text style={{...textStyle}}>
				{action.name}
			</Text>
		</Pressable>
	)
}
