FROM node:20

WORKDIR /app

COPY ./frontend ./

RUN npm install && npm run build

EXPOSE 3000 80

CMD ["npx", "serve", "-s", "build", "-l", "80"]
