FROM node:17-buster

WORKDIR /app

RUN apt update -y
RUN apt install -y python3 python3-pip
COPY requirements.txt ./
RUN pip3 install --no-cache -r requirements.txt
COPY package.json package-lock.json  ./
RUN npm install



