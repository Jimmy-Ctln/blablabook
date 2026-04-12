# Dockerfile for the Vite/React frontend

# Use Node.js 20 Alpine as a lightweight base image
FROM node:20-alpine

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

# Expose port 5173 for preview server
EXPOSE 5173

# Serve the built frontend using Vite preview
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]
