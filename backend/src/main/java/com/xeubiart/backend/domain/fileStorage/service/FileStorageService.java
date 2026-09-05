package com.xeubiart.backend.domain.fileStorage.service;

import com.xeubiart.backend.domain.fileStorage.exceptions.FileStorageException;
import com.xeubiart.backend.domain.fileStorage.exceptions.InvalidFileException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {
    String save(MultipartFile file) throws InvalidFileException, FileStorageException;
    List<String> saveMultiple(List<MultipartFile> files);
    void delete(String key);

    // Used to serve images over HTTP
    Resource load(String key);
}
