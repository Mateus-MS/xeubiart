package com.xeubiart.backend.domain.work.DTO;

import com.xeubiart.backend.domain.work.model.TattooStyle;
import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class UpdateWorkRequest {
    private String title;
    private TattooStyle style;
    private String description;
    private Boolean visible;
}
