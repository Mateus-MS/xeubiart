package com.xeubiart.backend.services.fileService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{
    private final Path storageRoot = Paths.get("uploads").toAbsolutePath().normalize();

    @Override
    public String save(MultipartFile file) throws IOException {
        if (!isFileValid(file)) {
            throw new IllegalArgumentException("Invalid file");
        }

        Files.createDirectories(storageRoot);

        String extension = getExtension(file.getOriginalFilename());
        String key = UUID.randomUUID() + extension;

        Path destination = storageRoot.resolve(key);

        file.transferTo(destination);

        return key;
    }

    @Override
    public void delete(String key) throws IOException {
        Path file = resolve(key);

        Files.deleteIfExists(file);
    }

    private boolean isFileValid(MultipartFile file){
        if (file == null || file.isEmpty()) {
            return false;
        }

        if (file.getContentType() == null) {
            return false;
        }

        return file.getContentType().startsWith("image/");
    }

    private String getExtension(String filename) {
        if (filename == null || filename.isBlank()) {
            return "";
        }

        int dot = filename.lastIndexOf('.');

        if (dot == -1) {
            return "";
        }

        return filename.substring(dot).toLowerCase();
    }

    private Path resolve(String key) {
        Path path = storageRoot.resolve(key).normalize();

        if (!path.startsWith(storageRoot)) {
            throw new IllegalArgumentException("Invalid file key");
        }

        return path;
    }
}
