package com.xeubiart.backend.controllerAdvice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ErrorResponse> handleApiException(APIException ex) {
        return ResponseEntity
            .status(ex.getStatus())
            .body(
                new ErrorResponse(
                    ex.getStatus(),
                    ex.getCode(),
                    ex.getMessage(),
                    Instant.now()
                )
            );
    }

}
