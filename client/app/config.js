const {MD3LightTheme} = require("react-native-paper");
module.exports = {
	"defaultServerUrl": "http://92.148.23.72:8080",
	"serverUrl": "http://92.148.23.72:8080",
	"DarkTheme": {
		...MD3LightTheme,
		dark: true,

		colors: {
			...MD3LightTheme.colors,
			primary: '#9a5373',
			accent: '#f1c40f',
			background: '#121313',
			surface: '#121313',
			text: '#ecf0f1',
			textColor: '#ecf0f1',
			disabled: '#ecf0f1',
			placeholder: '#ecf0f1',
			backdrop: '#121313',
			notification: '#f1c40f',
		},

	}
}

