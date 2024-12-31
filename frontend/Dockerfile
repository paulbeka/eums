FROM node:20

WORKDIR /app

COPY ./frontend/package*.json /app/

RUN npm install && npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "80"]
