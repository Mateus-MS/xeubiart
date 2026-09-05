package com.xeubiart.backend.controllerAdvice;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public record ErrorResponse(
        HttpStatus status,
        String error,
        String message,
        Instant timestamp
){}
