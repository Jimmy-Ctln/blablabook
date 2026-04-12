# Dockerfile for the Node.js backend

# Use Node.js 20 Alpine as a lightweight base image
FROM node:20-alpine

# Install curl for healthchecks or testing purposes, then clean cache
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of the backend source code into the container
COPY . .

# Build the application
RUN npm run build

# Clean dev dependencies to reduce image size (optional, comment out if you need them)
RUN npm prune --production

# Expose backend API port
EXPOSE 3000

# Copy start.sh script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Start the backend application via start.sh script
CMD ["./start.sh"]
