# ---- BUILD STAGE ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build


# ---- PRODUCTION STAGE ----
FROM node:20-alpine

WORKDIR /app

# only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# copy build output
COPY --from=builder /app/dist ./dist

# copy runtime scripts
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]