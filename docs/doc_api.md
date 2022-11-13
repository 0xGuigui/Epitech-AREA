
# Area API documentation

## Table of contents


- [Environment Variables](#environment_variables)
- [Run Locally](#run_locally)
- [API routes](#api_routes)
    - [Usage](#usage)
    - [About](#about)
    - [Authentification](#auth)
    - [User](#user)
    - [Oauth2](#oauth2)
    - [Services](#services)
    - [User AREAs](#user_areas)
    - [Admin Routes](#admin_routes)
- [Authors](#authors)
## Environment Variables <a name="environment_variables" />

To run this project, you will need to add the following environment variables to your .env file

The .env file needs to be at the root of the repository

`MONGO_INITDB_ROOT_USERNAME`

`MONGO_INITDB_ROOT_PASSWORD`

`AREA_MONGO_PORT`

`AREA_SERVER_PORT`

`JWT_SECRET`

`JWT_REFRESH_SECRET`

`JWT_ACCESS_SECRET`

`MAIL_SERVICE`

`MAIL_USER`

`MAIL_PASSWORD`

`RIOT_TOKEN`

`SPOTIFY_CLIENT_ID`

`SPOTIFY_CLIENT_SERET`

`DISCORD_CLIENT_ID`

`DISCORD_CLIENT_SECRET`

`REDDIT_CLIENT_ID`

`REDDIT_CLIENT_SECRET`

`REDDIT_MOBILE_CLIENTID`

`REDDIT_MOBILE_CLIENT_SECRET`

`TWITCH_CLIENT_ID`

`TWITCH_CLIENT_SECRET`

`STEAM_TOKEN`

## Run Locally <a name="run_locally" />

Clone the project

```bash
  git clone git@github.com:EpitechPromo2025/B-DEV-500-LIL-5-1-area-guilhem.jehanno.git
```

Go to the project directory

```bash
  cd B-DEV-500-LIL-5-1-area-guilhem.jehanno
```

Install **repository** dependencies

```bash
  npm install
```

Start the MongoDB docker

```bash
  sudo docker-compose up area-mongo -d
```

Go to the server directory

```bash
  cd server
```

Install **server** dependencies

```bash
  npm install
```

Start the server

```bash
  node .
```

# API routes <a name="api_routes" />

## Usage <a name="usage" />

All routes which require an token or a body need to have the following headers:

| Header | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer {token}` | Add this for all routes except about.json and authentification routes |
| `Content-Type` | `application/json` | Add this if you need to send a body to the server |

## About <a name="about" />

#### Get api information

```http
  GET /about.json
```

## Authentification <a name="auth" />

#### Register

```http
  POST /register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. user username|
| `email`      | `string` | **Required**. user email|
| `password`      | `string` | **Required**. user password|

#### Login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. user email|
| `password`      | `string` | **Required**. user password|

#### Login with Discord

```http
  POST /login/Discord
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `code`      | `string` | **Required**. code recieved when the user accepts [Oauth2 authentification](https://oauth.net/2/)|
| `redirect_uri`      | `string` | **Required**. redirect_uri used with [Oauth2 authentification](https://oauth.net/2/)|

#### Refresh token

```http
  POST /refresh
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `jwt`      | `string` | **Optional**. Should be in the cookies by default, otherwise refresh_token recieved when the user logged|

#### Reset password

```http
  POST /reset-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. user email|

#### Reset password

```http
  POST /reset-password/{token}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. token recieved by mail to reset the password|
| `newPassword`      | `string` | **Required**. new user password|

#### Logout

```http
  POST /logout
```

Clears the jwt cookie

## User <a name="user" />

#### Get user infos

```http
  GET /me
```

#### Update user infos

```http
  POST /me
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Optional**. new email |
| `username`      | `string` | **Optional**. new username |

#### Delete user

```http
  DELETE /me
```

#### Update user password

```http
  POST /me/update-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `password`      | `string` | **Required**. current password |
| `newPassword`      | `string` | **Required**. new password |

## Oauth2 <a name="oauth2" />

#### Register an Oauth2 app

```http
  POST /oauth2/{service}?mobile={mobile}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service you want to register|
| `mobile`      | `boolean` | **Optional**. since some APIs need a different client_secret, you have to specify if the request comes from a mobile|
| `code`      | `string` | **Required**. code recieved when the user accepts [Oauth2 authentification](https://oauth.net/2/) |
| `redirect_uri`      | `string` | **Required**. redirect_uri used with [Oauth2 authentification](https://oauth.net/2/)|

#### Unregister an Oauth2 app

```http
  DELETE /oauth2/{service}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service you want to register|

#### Check Oauth2 token

```http
  GET /oauth2/{service}/check-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service you want to check|

## Services <a name="services" />

#### Get services

```http
  GET /services
```

#### Get a service

```http
  GET /services/{service}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's actions

```http
  GET /services/{service}/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's reactions

```http
  GET /services/{service}/reactions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's action

```http
  GET /services/{service}/actions/{actionName}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|
| `actionName`      | `string` | **Required**. name of the action|

#### Get a service's reaction

```http
  GET /services/{service}/reactions/{reactionName}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|
| `reactionName`      | `string` | **Required**. name of the reaction|

## User AREAs <a name="user_areas" />

#### Get a user's AREAs

```http
  GET /me/actions
```

#### Create an AREA

```http
  POST /me/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Optional**. name of the AREA|
| `actionType`      | `string` | **Required**. a concatenation of the service name and the action name separated by a /|
| `reactionType`      | `string` | **Required**. a concatenation of the service name and the reaction name separated by a /|
| `{data}`      | `mixed` | **Required**. data fields required by the 'field' field of the action / reaction |

#### Delete all user AREAs

```http
  DELETE /me/actions
```

#### Get a user's AREA

```http
  GET /me/actions/{actionId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `actionId`      | `string` | **Required**. AREA's id|

#### Delete a user's AREA

```http
  DELETE /me/actions/{actionId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `actionId`      | `string` | **Required**. AREA's id|

#### Execute a user's AREA

```http
  POST /me/actions/{actionId}/execute
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `actionId`      | `string` | **Required**. AREA's id|

## Admin Routes <a name="admin_routes" />

#### Purge database

```http
  DELETE /purge-database
```

#### Get websocket for graphs

```http
  GET /server-stream-events
```

#### Get users

```http
  GET /users
```

#### Get a user

```http
  GET /users/{userId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|

#### Update user infos

```http
  POST /user/{userId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|
| `email`      | `string` | **Optional**. new email |
| `username`      | `string` | **Optional**. new username |
| `admin`      | `boolean` | **Optional**. set if user is an admin |
| `verified`      | `boolean` | **Optional**. set if user is verified |

#### Delete a user

```http
  DELETE /user/{userId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|

#### Logout a user

```http
  GET /user/{userId}/logout
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|

#### Get a user's AREAs

```http
  GET /user/{userId}/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|

#### Create an AREA

```http
  POST /user/{userId}/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|
| `name`      | `string` | **Optional**. name of the AREA|
| `actionType`      | `string` | **Required**. a concatenation of the service name and the action name separated by a /|
| `reactionType`      | `string` | **Required**. a concatenation of the service name and the reaction name separated by a /|
| `{data}`      | `mixed` | **Required**. data fields required by the 'field' field of the action / reaction |

#### Delete all user AREAs

```http
  DELETE /user/{userId}/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|

#### Get a user's AREA

```http
  GET /user/{userId}/actions/{actionId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|
| `actionId`      | `string` | **Required**. AREA's id|

#### Delete a user's AREA

```http
  DELETE /user/{userId}/actions/{actionId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. user id|
| `actionId`      | `string` | **Required**. AREA's id|

#### Get services

```http
  GET /services
```

#### Get a service

```http
  GET /services/{service}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's actions

```http
  GET /services/{service}/actions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's reactions

```http
  GET /services/{service}/reactions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|

#### Get a service's action

```http
  GET /services/{service}/actions/{actionName}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|
| `actionName`      | `string` | **Required**. name of the action|

#### Get a service's reaction

```http
  GET /services/{service}/reactions/{reactionName}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `service`      | `string` | **Required**. name of the service|
| `reactionName`      | `string` | **Required**. name of the reaction|


## Authors <a name="Authors" />

- [@Paul Gervais](https://github.com/Gagonlaire)
- [@Julien Hennion](https://github.com/Yusisako)
- [@Guilhem Jéhanno](https://github.com/Nysioko)
- [@Florian Garnier](https://github.com/Suolumi)
- [@Antoine Paul](https://github.com/PAn-27)

