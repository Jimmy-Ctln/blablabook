# ---- BUILD STAGE ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build && ls -la dist


# ---- PRODUCTION STAGE ----
FROM node:20-alpine

#Add curl
RUN apk add --no-cache curl

WORKDIR /app

# only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# copy build output
COPY --from=builder /app/dist ./dist

# copy drizzle config
COPY drizzle.config.ts ./drizzle.config.ts

# copy runtime scripts
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]