FROM node:9-alpine

EXPOSE 8081
VOLUME ["/opt/server-matcha/public"]

RUN mkdir -p /opt/matcha-server
WORKDIR /opt/matcha-server
ADD https://raw.githubusercontent.com/eficode/wait-for/master/wait-for /opt
RUN chmod 755 /opt/wait-for

COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN chown node:node ./public/uploads/

CMD [ "npm", "start" ]
