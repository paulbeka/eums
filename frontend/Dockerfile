# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY ./frontend/package*.json /app/

# Install dependencies
RUN npm install

# Copy frontend files
COPY ./frontend /app

# Expose frontend port
EXPOSE 3000
