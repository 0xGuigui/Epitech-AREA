const {MD3LightTheme} = require("react-native-paper");

const oauth2 = {
	"Spotify": {
		client_id: "e62780e3630e4439b855928a8514e977",
		redirect_uri: "http://92.148.23.72:8080/oauth2/Spotify",
		scopes: "user-read-private user-read-email user-read-playback-state user-modify-playback-state app-remote-control playlist-read-private",
	},
	"Discord": {
		client_id: "1022518270202499072",
		redirect_uri: "http://92.148.23.72:8080/oauth2/Discord",
		scopes: "identify email guilds guilds.members.read connections"
	},
	"Twitch": {
		client_id: "ekj703fl2fqbgmhurg7pl0ufkikmnk",
		redirect_uri: "http://92.148.23.72:8080/oauth2/Twitch",
		scopes: "user:manage:whispers%20user:edit%20user:read:follows"
	},
	"Reddit": {
		client_id: "jw-vAdRZIVhcdojFkr2iuw",
		redirect_uri: "http://92.148.23.72:8080/oauth2/Reddit",
		scopes: "identity mysubreddits history privatemessages",
		state: "0e7b5b87003476a68c081aaeb140b577127102a02ebe50925530be0cee86cb0043b371480397ab26050f7de5e0799488aa0d3d22d490dd4b70ac068a66757061d14fbe04392e92608b694c700443c4bf30f5b87a2807bfc816203426a24f06d1980180807db1aa0ce4b63890523a6c50b1270b480285538fe0a150ee19"
	}
}

//TODO check client_id (discord is not valid)

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
		},
		"Discord": {
			...oauth2.Discord,
			oauth_uri: `https://discord.com/api/oauth2/authorize?client_id=${oauth2.Spotify.client_id}&redirect_uri=${oauth2.Discord.redirect_uri}&response_type=code&scope=${oauth2.Discord.scopes}`
		},
		"Twitch": {
			...oauth2.Twitch,
			oauth_uri: `https://id.twitch.tv/oauth2/authorize?client_id=${oauth2.Twitch.client_id}&redirect_uri=${oauth2.Twitch.redirect_uri}&scope=${oauth2.Twitch.scopes}&response_type=code`
		},
		"Reddit": {
			...oauth2.Reddit,
			oauth_uri: `https://www.reddit.com/api/v1/authorize?client_id=${oauth2.Reddit.client_id}&response_type=code&state=${oauth2.Reddit.state}&redirect_uri=${oauth2.Reddit.redirect_uri}&duration=permanent&scope=${oauth2.Reddit.scopes}`
		}
	}
}

