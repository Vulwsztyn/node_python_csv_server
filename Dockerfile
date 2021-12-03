FROM node:17-buster

WORKDIR /app

RUN apt update -y
COPY package.json package-lock.json  ./
RUN npm install



