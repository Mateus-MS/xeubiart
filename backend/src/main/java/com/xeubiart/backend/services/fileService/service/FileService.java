package com.xeubiart.backend.services.fileService.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {
    String save(MultipartFile file) throws IOException;
    List<String> saveMultiple(List<MultipartFile> files) throws IOException;
    void delete(String key) throws IOException;

    // Used to serve images over HTTP
    Resource load(String key) throws IOException;
}
