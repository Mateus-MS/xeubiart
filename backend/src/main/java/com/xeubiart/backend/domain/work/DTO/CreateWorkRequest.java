package com.xeubiart.backend.domain.work.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class CreateWorkRequest{
    @NotBlank private String title;
    @NotBlank private String style;
    @NotBlank private String description;
    @NotNull List<MultipartFile> photos;
    private boolean visible;
}
