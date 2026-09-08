package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.controllerAdvice.exceptions.ResourceNotFoundException;
import com.xeubiart.backend.domain.work.DTO.AdminWorkResponse;
import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.PublicWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface WorkService {
    void create(CreateWorkRequest request);
    void update(UUID id, UpdateWorkRequest request, List<MultipartFile> images) throws ResourceNotFoundException;

    Page<PublicWorkResponse> findPublic(Pageable pageable);
    Page<AdminWorkResponse> findForAdmin(Boolean visible, Pageable pageable);
}
