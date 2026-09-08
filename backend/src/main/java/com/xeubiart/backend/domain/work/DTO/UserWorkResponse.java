package com.xeubiart.backend.domain.work.DTO;

import com.xeubiart.backend.domain.work.model.TattooStyle;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class UserWorkResponse {
    private UUID id;
    private String title;
    private TattooStyle style;
    private String description;
    private List<String> photosURLs;

    // User specific data like invoices
}
