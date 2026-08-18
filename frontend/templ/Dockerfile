FROM golang:1.26-alpine AS builder
WORKDIR /app
ENV GOTOOLCHAIN=auto
COPY . .
RUN go build -o bff-server main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/bff-server .
EXPOSE 8081
CMD ["./bff-server"]