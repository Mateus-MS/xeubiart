package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface WorkService {
    void create(CreateWorkRequest request);
    Page<SearchWorkResponse> find(Boolean visible, Pageable pageable);
    void update(UUID id, UpdateWorkRequest request);
}
