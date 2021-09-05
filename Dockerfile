FROM node:15-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

EXPOSE 3000

ENV TZ=America/Toronto

CMD [ "npm", "start" ]