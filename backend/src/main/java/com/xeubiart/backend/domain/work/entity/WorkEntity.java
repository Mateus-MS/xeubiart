package com.xeubiart.backend.domain.work.entity;

import com.xeubiart.backend.domain.work.model.TattooStyle;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_works")
@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class WorkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TattooStyle style;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private boolean visible;

    @ElementCollection
    @CollectionTable(
            name = "tb_work_photos",
            joinColumns = @JoinColumn(name = "work_id")
    )
    @OrderColumn(name = "photo_order")
    private List<PhotoEntity> photos;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "url", column = @Column(name = "thumbnail_url")),
            @AttributeOverride(name = "width", column = @Column(name = "thumbnail_width")),
            @AttributeOverride(name = "height", column = @Column(name = "thumbnail_height"))
    })
    private PhotoEntity thumbnail;
}