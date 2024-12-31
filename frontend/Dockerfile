# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy frontend files
COPY ./frontend /app

# Install dependencies and build the React app
RUN npm install

# Expose frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "start", "--host", "0.0.0.0"]
