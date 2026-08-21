# Stage 1: Build all frontend assets
FROM node:24-alpine AS builder
WORKDIR /app

# Copy the entire frontend folder structure so relative @source paths match
COPY frontend/ ./frontend/

# 1. Build Tailwind CSS
WORKDIR /app/frontend/tailwind
RUN npm install
RUN npx @tailwindcss/cli -i ./input.css -o ./dist/tailwind.css --minify

# 2. Build Shared UI Library
WORKDIR /app/frontend/ui
RUN npm install
RUN npx vite build

# 3. Build Angular Application
WORKDIR /app/frontend/angular
RUN npm install
RUN npm run build

# Stage 2: Caddy with all static assets baked in
FROM caddy:latest
WORKDIR /app

# Copy built artifacts from their respective nested directories
COPY --from=builder /app/frontend/angular/dist/angular/browser /app/angular
COPY --from=builder /app/frontend/tailwind/dist /app/tailwind/dist
COPY --from=builder /app/frontend/ui/dist /app/ui/dist
COPY frontend/static /app/static