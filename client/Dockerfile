FROM node:9-alpine

ENV HOST $HOST
EXPOSE 8080

RUN mkdir -p /opt/matcha-client
WORKDIR /opt/matcha-client

COPY package*.json ./
RUN npm install
COPY . .

USER node
CMD [ "npm", "start" ]
