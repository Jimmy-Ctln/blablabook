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

# Install only production dependencies
RUN npm install --production

# Copy the rest of the backend source code into the container
COPY . .

# Expose backend API port
EXPOSE 3000

# Start the backend application
CMD ["node", "dist/main.js"]
