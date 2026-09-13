package com.xeubiart.backend.domain.work.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class PhotoEntity {
    @Column(nullable = false)
    private String url;
    @Column(nullable = false)
    private int width;
    @Column(nullable = false)
    private int height;
}
