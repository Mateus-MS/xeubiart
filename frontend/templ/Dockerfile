FROM golang:1.26-alpine AS builder
WORKDIR /app

# Copy dependency files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Generate the Go code from Templ files inside the container
RUN go tool templ generate

# Build the backend application
RUN go build -o bff-server main.go

# Final lightweight stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/bff-server .
EXPOSE 8081
CMD ["./bff-server"]