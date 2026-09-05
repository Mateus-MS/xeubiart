package com.xeubiart.backend.domain.fileStorage.exceptions;

import com.xeubiart.backend.controllerAdvice.APIException;
import org.springframework.http.HttpStatus;

public class FileStorageException extends APIException {
    public FileStorageException(String message, Throwable cause) {
        super(message, cause, HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR");
    }
}
