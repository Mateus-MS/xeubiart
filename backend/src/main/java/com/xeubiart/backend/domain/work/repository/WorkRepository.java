package com.xeubiart.backend.domain.work.repository;

import com.xeubiart.backend.domain.work.entity.WorkEntity;
import com.xeubiart.backend.domain.work.model.TattooStyle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkRepository extends JpaRepository<WorkEntity, UUID> {
    Page<WorkEntity> findByVisibleTrue(Pageable pageable);
    WorkEntity findByIdAndVisibleTrue(UUID id);
    Page<WorkEntity> findByVisibleFalse(Pageable pageable);
    Page<WorkEntity> findByVisible(boolean visible, Pageable pageable);
//    Page<WorkEntity> findByCustomerId(UUID customerId, Pageable pageable);
    Page<WorkEntity> findByVisibleTrueAndStyle(TattooStyle style, Pageable pageable);
    WorkEntity findByIdAndVisibleTrueAndStyle(UUID id, TattooStyle style);

    @Query("""
        SELECT w
        FROM WorkEntity w
        WHERE w.visible = true
          AND (:style IS NULL OR w.style = :style)
        ORDER BY FUNCTION('RANDOM')
    """)
    List<WorkEntity> findRandomVisible(
            @Param("style") TattooStyle style,
            Pageable pageable
    );
}
