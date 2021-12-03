FROM node:17-buster

WORKDIR /app

RUN apt update -y
COPY package.json package-lock.json  ./
RUN npm install
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
RUN echo "deb https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
RUN apt update
RUN apt install k6


