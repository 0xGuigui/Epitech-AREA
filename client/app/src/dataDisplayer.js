import {StyleSheet, Text, View} from "react-native";
import {Pressable} from "@react-native-material/core";

export default function DataDisplayer({style, textStyle, onPress, text, keyProp}) {


	return (
		<Pressable style={{...style}} onPress={onPress}>
			<Text key={keyProp} style={{...textStyle}}>
				{text}
			</Text>
		</Pressable>
	)
}
