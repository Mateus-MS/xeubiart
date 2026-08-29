package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import com.xeubiart.backend.domain.work.repository.WorkRepository;
import com.xeubiart.backend.services.fileService.FileService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Transactional
public class WorkServiceImpl implements WorkService{
    private FileService fileService;
    private WorkRepository workRepository;

    @Override
    public void create(CreateWorkRequest request) {
        WorkEntity work = WorkEntity.builder()
                .title(request.getTitle())
                .style(request.getStyle())
                .description(request.getDescription())
                .visible(request.isVisible())
                .build();

        this.workRepository.save(work);
    }

    @Override
    public Page<SearchWorkResponse> findAll(Pageable pageable) {
        return workRepository
                .findAll(pageable)
                .map(this::toResponse);
    }

    private SearchWorkResponse toResponse(WorkEntity work) {
        return new SearchWorkResponse(
                work.getId(),
                work.getTitle(),
                work.getStyle(),
                work.getDescription(),
                work.getPhotosURLs()
        );
    }
}
