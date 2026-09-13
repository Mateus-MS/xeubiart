package com.xeubiart.backend.domain.imageMetadata.service;

import com.xeubiart.backend.domain.imageMetadata.models.ImageDimensions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@Service
public class ImageMetadataServiceImpl implements ImageMetadataService {

    @Override
    public ImageDimensions getDimensions(MultipartFile file) {
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());

            if (image == null) {
                throw new IllegalArgumentException("Invalid image");
            }

            return new ImageDimensions(
                    image.getWidth(),
                    image.getHeight()
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to read image dimensions", e);
        }
    }
}