FROM node:latest

WORKDIR /home/neha/socket_srvice

COPY package*.json ./

RUN npm install -g npm@10.2.5

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "servers.js"]
