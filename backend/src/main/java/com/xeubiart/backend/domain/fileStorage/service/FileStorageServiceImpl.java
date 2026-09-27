package com.xeubiart.backend.domain.fileStorage.service;

import com.xeubiart.backend.domain.fileStorage.exceptions.FileStorageException;
import com.xeubiart.backend.domain.fileStorage.exceptions.InvalidFileException;
import com.xeubiart.backend.domain.fileStorage.exceptions.InvalidFileKeyException;
import com.xeubiart.backend.domain.fileStorage.exceptions.StoredFileNotFoundException;
import com.xeubiart.backend.domain.imageMetadata.models.ImageDimensions;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private final Path storageRoot;

    public FileStorageServiceImpl(@Value("${app.storage.root}") String storageRoot){
        this.storageRoot = Paths.get(storageRoot)
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public String save(MultipartFile file) {
        if (!this.isFileValid(file)) {
            throw new InvalidFileException("Invalid image file");
        }

        try {
            Files.createDirectories(storageRoot);

            String extension = getExtension(file.getOriginalFilename());
            String key = UUID.randomUUID() + extension;

            Path destination = storageRoot.resolve(key);

            file.transferTo(destination);

            return key;
        } catch (IOException e) {
            throw new FileStorageException("Failed to save file", e);
        }
    }

    @Override
    public List<String> saveMultiple(List<MultipartFile> files) {
        if (files == null) {
            return List.of();
        }

        List<String> urls = new ArrayList<>();

        for (MultipartFile image : files) {
            if (!image.isEmpty()) {
                urls.add(this.save(image));
            }
        }

        return urls;
    }

    @Override
    public void delete(String key) {
        Path file = resolve(key);

        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + key, e);
        }
    }

    @Override
    public Resource load(String key) {
        Path file = resolve(key);

        try {
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new StoredFileNotFoundException("File not found: " + key);
            }

            return resource;
        } catch (IOException e) {
            throw new FileStorageException("Failed to load file: " + key, e);
        }
    }

    @Override
    public ImageDimensions createThumbnail(String sourceUrl, String targetUrl, int maxWidth, int maxHeight) {
        try {
            Path sourcePath = resolve(sourceUrl);
            Path targetPath = resolve(targetUrl);

            if (targetPath.getParent() != null) {
                Files.createDirectories(targetPath.getParent());
            }

            // Writes directly to disk; format is inferred automatically from targetPath extension
            Thumbnails.of(sourcePath.toFile())
                    .size(maxWidth, maxHeight)
                    .toFile(targetPath.toFile());

            // Read scaled image to return accurate target dimensions
            BufferedImage scaledImage = ImageIO.read(targetPath.toFile());
            return new ImageDimensions(scaledImage.getWidth(), scaledImage.getHeight());

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate thumbnail from " + sourceUrl, e);
        }
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
            throw new InvalidFileKeyException("Invalid file key");
        }

        return path;
    }

    @Override
    public void copy(String sourceUrl, String targetUrl) {
        try {
            // Extract relative paths/filenames from URLs
            Path sourcePath = resolve(sourceUrl);
            Path targetPath = resolve(targetUrl);

            // Ensure target directory exists
            if (targetPath.getParent() != null) {
                Files.createDirectories(targetPath.getParent());
            }

            // Copy file, overwriting if target already exists
            Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            throw new RuntimeException("Failed to copy file from " + sourceUrl + " to " + targetUrl, e);
        }
    }
}
