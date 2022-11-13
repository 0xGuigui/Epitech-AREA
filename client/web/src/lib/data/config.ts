const oauth2 = {
    "Spotify": {
        client_id: "e62780e3630e4439b855928a8514e977",
        redirect_uri: "http://localhost:3000/oauth2/Spotify",
        scopes: "user-read-private user-read-email user-read-playback-state user-modify-playback-state app-remote-control playlist-read-private",
    },
    "Discord": {
        client_id: "1022518270202499072",
        redirect_uri: "http://localhost:3000/oauth2/Discord",
        scopes: "identify email guilds guilds.members.read connections",
        login_scopes: "identify email"
    },
    "Reddit": {
        client_id: "OYLm6Eh9OUu2VrJxtBs-mg",
        redirect_uri: "http://localhost:3000/oauth2/Reddit",
        scopes: "identity mysubreddits history privatemessages",
        state: "0e7b5b87003476a68c081aaeb140b577127102a02ebe50925530be0cee86cb0043b371480397ab26050f7de5e0799488aa0d3d22d490dd4b70ac068a66757061d14fbe04392e92608b694c700443c4bf30f5b87a2807bfc816203426a24f06d1980180807db1aa0ce4b63890523a6c50b1270b480285538fe0a150ee19"
    }
}

export default {
    "defaultServerUrl": "http://92.148.23.72:8080",
    "Oauth2": {
        "Spotify": {
            ...oauth2.Spotify,
            oauth_uri: `https://accounts.spotify.com/authorize?response_type=code&client_id=${oauth2.Spotify.client_id}&scope=${oauth2.Spotify.scopes}&redirect_uri=${oauth2.Spotify.redirect_uri}`
        },
        "Discord": {
            ...oauth2.Discord,
            oauth_uri: `https://discord.com/api/oauth2/authorize?client_id=${oauth2.Discord.client_id}&redirect_uri=${oauth2.Discord.redirect_uri}&response_type=code&scope=${oauth2.Discord.scopes}`,
            login_uri: `https://discord.com/api/oauth2/authorize?client_id=${oauth2.Discord.client_id}&redirect_uri=${oauth2.Discord.redirect_uri}&response_type=code&scope=${oauth2.Discord.login_scopes}`
        },
        "Reddit": {
            ...oauth2.Reddit,
            oauth_uri: `https://www.reddit.com/api/v1/authorize.compact?client_id=${oauth2.Reddit.client_id}&response_type=code&state=${oauth2.Reddit.state}&redirect_uri=${oauth2.Reddit.redirect_uri}&duration=permanent&scope=${oauth2.Reddit.scopes}`
        }
    }
}
