package com.xeubiart.backend.domain.work.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class PhotoEntity {
    private String url;
    private int width;
    private int height;
}
