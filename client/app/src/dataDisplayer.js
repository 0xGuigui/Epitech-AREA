import {StyleSheet, Text, View, Image} from "react-native";
import {Pressable} from "@react-native-material/core";



export default function DataDisplayer({style, textStyle, onPress, text, keyProp, icon, colorBackground}) {


	return (
		<Pressable style={{...style, backgroundColor: colorBackground}} onPress={onPress} key={keyProp}>
			<Image source={icon} style={{width: 40, height: 40, position: 'absolute', right: 70, top: 25}}/>
			<Text key={keyProp} style={{...textStyle}}>
				{text}
			</Text>
		</Pressable>
	)
}
