# develop stage
FROM node:13.7-alpine as develop-stage
WORKDIR /app
COPY package*.json ./app/
RUN yarn global add @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn install --production