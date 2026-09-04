package com.xeubiart.backend.services.fileService.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{
    private final Path storageRoot;

    public FileServiceImpl(@Value("${app.storage.root}") String storageRoot){
        this.storageRoot = Paths.get(storageRoot)
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public String save(MultipartFile file) throws IOException {
        if (!this.isFileValid(file)) {
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
    public List<String> saveMultiple(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();

        if (files != null) {
            for (MultipartFile image : files) {
                if (image.isEmpty()) {
                    continue;
                }

                try {
                    urls.add(this.save(image));
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save image", e);
                }
            }
        }

        return urls;
    }

    @Override
    public void delete(String key) throws IOException {
        Path file = resolve(key);

        Files.deleteIfExists(file);
    }

    @Override
    public Resource load(String key) throws IOException {
        Path file = resolve(key);

        Resource resource = new UrlResource(file.toUri());

        if(!resource.exists() || !resource.isReadable()){
            throw new FileNotFoundException("File not found: " + key);
        }

        return resource;
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
