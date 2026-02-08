# Dockerfile for the Vite/React frontend

# Use Node.js 20 Alpine as a lightweight base image
FROM node:20-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy the rest of the frontend source code into the container
COPY . .

# Build the frontend (Vite) for production
RUN npm run build
