package com.xeubiart.backend.services.fileService;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String save(MultipartFile file) throws IOException;
    void delete(String key) throws IOException;
}
