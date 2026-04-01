# 1. Build React App
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production Server
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# SQLite native compilation requires python/make on some alpine versions, 
# but node:20-alpine usually handles pre-built sqlite3 binaries fine.
# We will install only production dependencies
RUN npm install --omit=dev

COPY server.js .
# Copy static frontend bundle
COPY --from=build /app/dist ./dist

# Create standard /data directory for Fly.io SQLite persistence
ENV DATA_DIR=/data
ENV PORT=3000

RUN mkdir -p /data

EXPOSE 3000
CMD ["npm", "start"]
