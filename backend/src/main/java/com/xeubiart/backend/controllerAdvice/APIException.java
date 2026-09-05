package com.xeubiart.backend.controllerAdvice;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class APIException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    public APIException(String message, HttpStatus status, String code){
        super(message);
        this.status = status;
        this.code = code;
    }

    public APIException(String message, Throwable cause, HttpStatus status, String code){
        super(message, cause);
        this.status = status;
        this.code = code;
    }
}