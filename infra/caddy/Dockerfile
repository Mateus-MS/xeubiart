# Stage 1: Build Dependencies and Assets
FROM node:24-alpine AS builder
WORKDIR /app

# 1. Build Tailwind CSS first
WORKDIR /app/tailwind
COPY frontend/tailwind/package*.json ./
RUN npm install
COPY frontend/tailwind/ ./
RUN npx @tailwindcss/cli -i ./input.css -o ./dist/tailwind.css --minify

# 2. Build Angular application
WORKDIR /app/angular
COPY frontend/angular/package*.json ./
RUN npm install
COPY frontend/angular/ ./
RUN npm run build

# Stage 2: Caddy with baked-in Angular static files
FROM caddy:latest
COPY --from=builder /app/angular/dist/angular/browser /app/angular