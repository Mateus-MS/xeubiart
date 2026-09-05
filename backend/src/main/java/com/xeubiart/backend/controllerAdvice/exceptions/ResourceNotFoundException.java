package com.xeubiart.backend.controllerAdvice.exceptions;

import com.xeubiart.backend.controllerAdvice.APIException;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends APIException {
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
