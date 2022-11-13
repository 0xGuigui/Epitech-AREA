FROM ubuntu:latest
USER root

##utils
RUN apt update && apt install -y curl git unzip xz-utils zip libglu1-mesa openjdk-17-jdk wget
RUN apt -y install cmake && apt -y install clang && apt -y install ninja-build && apt -y install pkg-config && apt -y install pkg-config && apt -y install libgtk-3-dev

##node
ENV NODE_VERSION=16.18.1
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

##android sdk and linux tool chain
WORKDIR /home/developer
RUN mkdir -p Android/sdk/cmdline-tools/latest/
ENV ANDROID_SDK_ROOT /home/developer/Android/sdk/cmdline-tools/latest
RUN mkdir -p .android && touch .android/repositories.cfg
RUN wget -O sdk-tools.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
RUN wget -O sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip
RUN unzip sdk-tools.zip && rm sdk-tools.zip
RUN mv cmdline-tools/* Android/sdk/cmdline-tools/latest
RUN cd Android/sdk/cmdline-tools/latest/bin && yes | ./sdkmanager --licenses
ENV PATH "$PATH:/home/developer/Android/cmdline-tools/latest/platform-tools"

## Dependencies install and Expo compilor
WORKDIR /home/developer/app
ENV PATH /app/node_modules/.bin:$PATH
ENV EXPO_TOKEN="U8JCsWnR7Fmls6lMlmwXteeEerGDHulFaqZVc0oP"
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
#RUN npm install react-scripts@5.0.0 -g
#RUN npx expo install expo-dev-client
RUN npm i --unsafe-perm --allow-root -g npm@latest expo-cli@latest
RUN npm install -g eas-cli
COPY . .
RUN git init
#RUN eas build:configure
CMD ["eas", "build", "--profile", "production", "--platform", "android"]
#CMD ["sh"]
