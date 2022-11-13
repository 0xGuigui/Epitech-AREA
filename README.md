<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/DQKJiLY.png" alt="Project logo"></a>
</p>

<h3 align="center">AREA Project</h3>
[![Foo - Bar](https://img.shields.io/badge/Foo-Bar-2ea44f?style=for-the-badge)](https://)

<div align="center">



</div>

---

<p align="center"> Action REAction - Automation platform of his digital life.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

AREA Project is a project similar to IFTTT, the objective is to offer a service that allows devices to be connected to each other and to automate certain tasks according to personalized scenarios.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

Docker: https://docs.docker.com/get-docker/ </br>
NPM: https://www.npmjs.com/get-npm </br>

### Installing

- Start by cloning the repository

```
git clone git@github.com:EpitechPromo2025/B-DEV-500-LIL-5-1-area-guilhem.jehanno.git
```

- Navigate to the repository

```
cd B-DEV-500-LIL-5-1-area-guilhem.jehanno
```

- Prepare website

```
cd client/web && npm install && cd ../app && npm install && cd ../../server && npm install && cd .. && npm install
```

- Starting Docker

```
docker-compose up -d
```

Now you can access the website at http://localhost:8080

The APK is available on Expo Website


## 🎈 Usage <a name="usage"></a>

You can create an account and start using the platform. </br>


## 🚀 Deployment <a name = "deployment"></a>

If you want to deploy the project on a live system, you can use the Dockerfile in the root of the repository.

- Start by cloning the repository

```
git clone git@github.com:EpitechPromo2025/B-DEV-500-LIL-5-1-area-guilhem.jehanno.git
```

- Navigate to the repository

```
cd B-DEV-500-LIL-5-1-area-guilhem.jehanno
```

- Prepare website

```
cd client/web && npm install && cd ../app && npm install && cd ../../server && npm install && cd .. && npm install
```

- Starting Docker

```
docker-compose up -d
```

Now you can access the website at http(s)://yourdomain.com

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [Svelte](https://svelte.dev/) - Web Framework
- [Vite](https://vitejs.dev/) - Webpack Alternative
- [React Native](https://reactnative.dev/) - Mobile Framework
- [Expo](https://expo.io/) - Mobile App Deployment
- [Docker](https://www.docker.com/) - Deployment
- [Node.js](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@Paul Gervais](https://github.com/Gagonlaire) 
- [@Julien Hennion](https://github.com/Yusisako)
- [@Florian Garnier](https://github.com/Suolumi)
- [@Antoine Paul](https://github.com/PAn-27)
- [@Guilhem Jéhanno](https://github.com/Nysioko)


## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Thanks all team members for their hard work
- Thanks [@Paul Gervais](https://github.com/Gagonlaire) for backend Architecture, Routing, Docker and DB
- Thanks [@Florian Garnier](https://github.com/Suolumi) for OAuth2, API, Mobile Frontend Functionalities
- Thanks [@Julien Hennion](https://github.com/Yusisako) for Frontend Architecture and Design
- Thanks [@Antoine Paul](https://github.com/PAn-27) for Android Docker Deployment
- Thanks [@Guilhem Jéhanno](https://github.com/Nysioko) for Mobile Frontend Architecture and Design, Docker and Mobile functionalities
