package com.xeubiart.backend.domain.work.repository;

import com.xeubiart.backend.domain.work.entity.WorkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkRepository extends JpaRepository<WorkEntity, UUID> {
}
