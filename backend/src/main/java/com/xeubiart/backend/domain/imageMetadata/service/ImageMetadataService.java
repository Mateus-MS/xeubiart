package com.xeubiart.backend.domain.imageMetadata.service;

import com.xeubiart.backend.domain.imageMetadata.models.ImageDimensions;
import org.springframework.web.multipart.MultipartFile;

public interface ImageMetadataService {
    ImageDimensions getDimensions(MultipartFile file);
}