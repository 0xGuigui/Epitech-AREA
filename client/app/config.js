const {MD3LightTheme} = require("react-native-paper");

const oauth2 = {
	"Spotify": {
		client_id: "e62780e3630e4439b855928a8514e977",
		redirect_uri: "http://92.148.23.72:8080/oauth2/Spotify",
		scopes: "user-read-private user-read-email user-read-playback-state user-modify-playback-state app-remote-control playlist-read-private",
	}
}

module.exports = process.globals = {
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

	},
	"Oauth2": {
		"Spotify": {
			...oauth2.Spotify,
			oauth_uri: `https://accounts.spotify.com/authorize?response_type=code&client_id=${oauth2.Spotify.client_id}&scope=${oauth2.Spotify.scopes}&redirect_uri=${oauth2.Spotify.redirect_uri}`
		}
	}
}

