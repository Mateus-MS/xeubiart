package com.xeubiart.backend.services.fileService.controller;

import com.xeubiart.backend.services.fileService.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@AllArgsConstructor
public class FileServiceController {
    private final FileService fileService;

    @GetMapping("/{key}")
    public ResponseEntity<Resource> getImage(@PathVariable String key) throws IOException {
        Resource resource = this.fileService.load(key);

        return ResponseEntity.ok()
                .contentType(MediaTypeFactory
                        .getMediaType(resource)
                        .orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resource);
    }
}
