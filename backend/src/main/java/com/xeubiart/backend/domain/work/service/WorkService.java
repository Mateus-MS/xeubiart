package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkService {
    void create(CreateWorkRequest request);
    Page<SearchWorkResponse> findAll(Pageable pageable);
}
