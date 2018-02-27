FROM node:9-alpine

EXPOSE 8081
VOLUME ["/usr/src/server-matcha/public"]

RUN mkdir -p /opt/matcha-server
WORKDIR /opt/matcha-server

COPY package*.json ./
RUN npm install
COPY . .
RUN chown node:node ./public/uploads/

USER node
CMD [ "npm", "start" ]
