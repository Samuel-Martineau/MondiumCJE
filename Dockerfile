FROM node:15-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

ENV NODE_ENV=production
ENV TZ=America/Toronto

CMD [ "npm", "start" ]