package com.xeubiart.backend.domain.work.exceptions;

import com.xeubiart.backend.controllerAdvice.APIException;
import org.springframework.http.HttpStatus;

public class InvalidPhotoOrderException extends APIException {
    public InvalidPhotoOrderException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "INVALID_PHOTOS_ORDER");
    }
}
