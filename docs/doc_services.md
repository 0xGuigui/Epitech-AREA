<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/DQKJiLY.png" alt="Project logo"></a>
</p>

<h3 align="center">AREA Services documentation</h3>
<div align="center">
</div>

---

## 📝 Table of Contents

- [Implement a service in the server](#implement-service-in-server)
    - [Create the files and register the service](#create_files)
    - [Create your first action / reaction](#create_action)
    - [Store and pass on data](#pass_data)
    - [Manage Oauth2 settings](#oauth2)
- [Implement a service in application client](#implement-service-in-application)
    - [Adding your icon](#add_icon)
    - [Customize your service inside the application](#customize_service)
      -  [Customize the service's card in the page of the actions/reactions creation](#customize_card)
      - [Customize your service's information in the `Manage Services` page](#customize_description)
- [Implement a service in web client](#implement-service-in-web)

## 👩‍💻 Implement a service in the server <a name='implement-service-in-server' />

### Create the files and register the service <a name='create_files' />

- To implement a new service in server side, you need to go to the `services` folder

```bash
  cd server/src/core/services
```

- Then, create a folder with the name of your service

```bash
  mkdir {service} && cd {service}
```

- After that, you must create a .js file with the name of the parent folder, it will be the entry file to register your service

```bash
  touch {service}.js
```

- In your .js file, you need to fill the following variables to create the instance of your service

```js
  module.exports = (area, servicesManager) => {
    const serviceName = new Service(serviceName, serviceDescription, {
        mainColor: serviceMainColor,
        secondaryColor: serviceSecondaryColor,
        urlSite: serviceUrl,
    })
  }
```

- Add the following line to register your service

```js
  servicesManager.addService(areaService)
```

- If everything was done correctly, the service will be loaded next time you start the server

### Create your first action / reaction <a name='create_action' />

- To create an action or a reaction, you must write something like this:

```js
  const actionName = new Action(actionName, actionDescription)
    .on('create', async (ctx) => {
        await ctx.next() // This line executes the reaction's onCreate, it is mandatory (even if you create a reaction)
    })
    .on('trigger', async (ctx) => {
        if (condition)
            await ctx.next() // You can call this when your action is fulfilled, it will trigger the reaction
        await ctx.end() // This line here is if you have data to save, we will come back on this later
    })
```
- The action's `onCreate` function will be called when the AREA is created,
then the reaction's `onCreate` will be called,
and the server will loop through the action's `onTrigger` every 10 seconds,
it will then call the reaction's `onTrigger` if the action's `onTrigger` executes `ctx.next()`

### Store and pass on data <a name='pass_data' />

- The `area` variable has 2 main functions:

```js
  area.setActionData('key', data)
  area.getActionData('key')
```

- With `area.setActionData`, you can set any data you want at any point during the create or trigger function. You can also get your data back at any point using `ctx.getActionData`
- If, in a trigger function you used `area.setActionData`, you have to either call `ctx.next` or `ctx.end` or your data **will not be saved**

### Manage Oauth2 settings <a name='oauth2' />

- If the service you want to implement has Oauth2, you have to add 2 more functions:

```js
    serviceName.setAuthentification(async (code, redirect_uri) => {
		const refreshToken = getRefreshToken()
        return refreshToken
	})

	serviceName.setCheckToken(async (token, userId) => {
		if (tokenValid)
            return true
        return false
	})
```

- The function in `setAuthentification` needs to return a refresh token, this token will be stored in the database, it takes in argument the code the user got when he accepted Oauth2, and the redirect_uri used by the service
- The function in `setCheckToken` needs to return either true or false depending on wether the token passed is valid or not

## 👩‍💻 Implement a service in application client <a name='implement-service-in-application' />

To implement a new service inside the application, you need to previously implement the service in the [server side](#implement-service-in-server). Then, you need to go to the `services` folder

In fact, your service is automatically detected by the application client. You just need to implement the icon and the description of your service inside the application.


- First, navigate to the core of the application

```bash
    cd client/app/
```

### Adding your icon <a name='add_icon' />

- Add you service icon inside the `assets` folder

```bash
    cd src/assets/img/
```

### Customize your service inside the application <a name='customize_service' />
#### Customize the service's card in the page of the actions/reactions creation <a name='customize_card' />

- Navigate to the folder which contains the services information data

```bash
    cd ../../main/createArea
```

- Now, add your service icon in `displayServices.js` as showed here:

````js
    import spotifyLogo from '../../assets/img/spotify_logo.png'
    import yourLogo from '../../assets/img/your_logo.png' // <--- Add your logo like this

    const logos = {
        Spotify: spotifyLogo,
        YourService: yourLogo   // <--- Add your logo inside the const variable for the application to detect it  
    }
````

#### Customize your service's information in the `Manage Services` page <a name='customize_description' />

- You also have to add informations about your service inside `serviceInfo.js` in the same folder as `displayServices.js`, such as logoHeader, description, url of your service or backgroundColor:

```js
    import spotifyLogo from '../../assets/img/spotify_logo.png'
    import SpotifyLogo from '../../assets/icons/spotify-logo-white.png'
    import yourLogo from '../../assets/img/your_logo.png' // <--- Add your logo like this
    import yourLogoHeader from '../../assets/img/your_logo_header.png' // <--- Add your logo header like this
    
    
    const data = {
        Spotify: {
            description: 'Spotify is a digital music, podcast, and video streaming service that gives you access to millions of songs and other content from artists all over the world. With Spotify, you can listen to millions of songs and podcasts for free. Listen to the songs and podcasts you love and find music from all over the world.\n\nSpotify is all the music you’ll ever need.',
            url: 'https://www.spotify.com/',
            backgroundColor: '#000000',
            headerLogo: SpotifyLogo,
            logo: spotifyLogo
        },
        YourService: {
            description: 'Your description of your service',
            url: 'Your service url',
            backgroundColor: 'Your service background color',
            headerLogo: yourLogoHeader, // <--- Add your logo header like this, of course, you can just use yourLogo if you don't want to create a logo header
            logo: yourLogo
        }
    }
```

- Finally, if you want to customize your service card inside the list of services, you can do it inside `listServices.js` in the same folder as `displayServices.js`, as showed here:

```js
    import spotifyLogo from '../../assets/img/spotify_logo.png'
    import discordLogo from '../../assets/img/discord_logo.png'
    import redditLogo from '../../assets/img/reddit_logo.png'
    import steamLogo from '../../assets/img/steam_logo.png'
    import leagueLogo from '../../assets/img/League.png'
    import AreaLogo from '../../assets/logo/logo.png'
    import yourLogo from '../../assets/img/your_logo.png' // <--- Add your logo like this
    
    const logos = {
        Discord: discordLogo,
        Spotify: spotifyLogo,
        Reddit: redditLogo,
        Steam: steamLogo,
        League: leagueLogo,
        AREA: AreaLogo,
        YourService: yourLogo // <--- Add your logo like this
    }
```
<br/>
Done, if you correctly followed the steps, your service will be displayed in the application client without any problems. You can now test your service and create actions/reactions with it.

### ⚠️ Please, don't forget to implement your service in the server side before implementing it in the application client.
