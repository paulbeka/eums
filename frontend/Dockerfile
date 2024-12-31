# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY ./frontend/package*.json /app/

# Install dependencies
RUN npm install && npm run build

# Copy frontend files
COPY ./frontend /app

# Expose frontend port
EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "80"]
