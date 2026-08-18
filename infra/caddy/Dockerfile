# Stage 1: Build the Angular application
FROM node:24-alpine AS builder
WORKDIR /app
COPY frontend/angular/package*.json ./angular/
WORKDIR /app/angular
RUN npm install
WORKDIR /app
COPY frontend/angular/ ./angular/
COPY frontend/tailwind/ ./tailwind/
WORKDIR /app/angular
RUN npm run build

# Stage 2: Caddy with baked-in Angular static files
FROM caddy:latest
COPY --from=builder /app/angular/dist/angular/browser /app/angular