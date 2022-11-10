import {StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";

export default function DataDisplayer({style, textStyle, onPress, text, key}) {


	return (
		<Pressable style={{...style}} onPress={onPress}>
			<Text key={key} style={{...textStyle}}>
				{text}
			</Text>
		</Pressable>
	)
}
