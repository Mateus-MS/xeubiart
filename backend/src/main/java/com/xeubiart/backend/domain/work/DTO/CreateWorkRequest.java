package com.xeubiart.backend.domain.work.DTO;

import com.xeubiart.backend.domain.work.model.TattooStyle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class CreateWorkRequest{
    @NotBlank private String title;
    @NotNull private TattooStyle style;
    @NotBlank private String description;
    @NotEmpty List<MultipartFile> images;
    private boolean visible;
}
