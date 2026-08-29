package com.xeubiart.backend.domain.work.DTO;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class SearchWorkResponse {
    private UUID id;
    private String title;
    private String style;
    private String description;
    List<String> photosUrls;
}
