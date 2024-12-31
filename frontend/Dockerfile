FROM node:20

WORKDIR /app

COPY ./frontend/package*.json /app/

RUN npm install && npm run build

COPY ./frontend /app

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "80"]
