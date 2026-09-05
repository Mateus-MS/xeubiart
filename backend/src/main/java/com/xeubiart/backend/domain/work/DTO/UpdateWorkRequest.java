package com.xeubiart.backend.domain.work.DTO;

import com.xeubiart.backend.domain.work.model.TattooStyle;
import lombok.*;

import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class UpdateWorkRequest {
    private String title;
    private TattooStyle style;
    private String description;
    private Boolean visible;
    private List<PhotoOrder> photos;

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
    public static class PhotoOrder{
        private String type;
        private String value;
    }
}