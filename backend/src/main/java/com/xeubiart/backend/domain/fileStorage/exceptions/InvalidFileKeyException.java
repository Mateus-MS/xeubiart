package com.xeubiart.backend.domain.fileStorage.exceptions;

import com.xeubiart.backend.controllerAdvice.APIException;
import org.springframework.http.HttpStatus;

public class InvalidFileKeyException extends APIException {
    public InvalidFileKeyException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "INVALID_FILE_KEY");
    }
}
