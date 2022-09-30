FROM node:14-alpine

# Maintainer: Guilhem Jéhanno <guilhem.jeh@gmail.com>

# Create app directory
WORKDIR /client_web

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm run build

# Bundle app source
COPY . .

EXPOSE 8081
ENV HOST=0.0.0.0

CMD [ "npm", "run", "build" ]
