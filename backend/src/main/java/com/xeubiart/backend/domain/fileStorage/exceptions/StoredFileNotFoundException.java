package com.xeubiart.backend.domain.fileStorage.exceptions;

import com.xeubiart.backend.controllerAdvice.APIException;
import org.springframework.http.HttpStatus;

public class StoredFileNotFoundException extends APIException {
    public StoredFileNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "FILE_NOT_FOUND");
    }
}
