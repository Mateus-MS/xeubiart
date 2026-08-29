package com.xeubiart.backend.domain.work.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class WorkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String style;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private boolean visible;

    @Column(nullable = false)
    private List<String> photosURLs;
}