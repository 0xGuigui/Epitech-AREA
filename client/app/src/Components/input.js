import {StyleSheet, Text, TextInput, View} from "react-native";

export default function Input({style, onChange, onChangeText, label, placeholder, value, defaultValue, secureTextEntry, inputStyle, labelStyle}) {
	return (
		<View style={{...styles.inputContainer, ...style}}>
			{label && <Text style={{...styles.inputLabel, ...labelStyle}}>{label || ""}</Text>}
			<TextInput style={styles.input} defaultValue={""} value={value} placeholder={placeholder} onChange={onChange} onChangeText={onChangeText} secureTextEntry={secureTextEntry}/>
		</View>
	)
}

const styles = StyleSheet.create({
	inputContainer: {

	},
	inputLabel: {
		textAlign: 'center',
		fontSize: 15
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		borderColor: 'white'
	}
});